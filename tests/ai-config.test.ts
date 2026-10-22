import assert from 'node:assert/strict';
import test from 'node:test';
import {
  canBindAiService,
  canPublishAiConfig,
  createAiConfigPayload,
  emptyAiBindings,
  validateAiConfig,
  validateAiService
} from '../src/utils/ai-config';
import type { AdminAiConfig, AiConfigDraft, AiServiceDraft } from '../src/utils/ai-config';

function service(overrides: Partial<AiServiceDraft> = {}): AiServiceDraft {
  return {
    id: 'service-1',
    name: '图文服务',
    protocol: 'chat-completions',
    baseUrl: 'https://example.com/v1',
    model: 'vision-model',
    enabled: true,
    timeoutMs: 600000,
    supportsVision: true,
    hasApiKey: true,
    apiKeyMasked: '••••abcd',
    ...overrides
  };
}

function draft(profile = service()): AiConfigDraft {
  return { enabled: true, services: [profile], bindings: { ...emptyAiBindings(), 'fission.analyze': profile.id } };
}

test('configuration save omits unchanged credentials and presentation-only fields', () => {
  const payload = createAiConfigPayload(draft(service({ apiKey: '  ' })), 7);
  assert.equal(payload.expectedDraftRevision, 7);
  assert.equal('apiKey' in payload.services[0], false);
  assert.equal('apiKeyMasked' in payload.services[0], false);
  assert.equal('hasApiKey' in payload.services[0], false);
});

test('replacement credential is sent only when explicitly entered', () => {
  const payload = createAiConfigPayload(
    draft(service({ apiKey: 'new-test-key', baseUrl: ' https://example.com/v1/ ' })),
    3
  );
  assert.equal(payload.services[0].apiKey, 'new-test-key');
  assert.equal(payload.services[0].baseUrl, 'https://example.com/v1');
});

test('binding prevents incompatible protocols, disabled services, and missing vision support', () => {
  assert.equal(canBindAiService('fission.analyze', service()), true);
  assert.equal(canBindAiService('free.optimize', service({ supportsVision: false })), false);
  assert.equal(canBindAiService('copywrite.generate', service({ enabled: false })), false);
  assert.equal(canBindAiService('live.generate', service()), false);
  assert.equal(canBindAiService('free.generate', service({ protocol: 'responses-image' })), true);
  assert.equal(canBindAiService('live.generate', service({ protocol: 'wan-video', supportsVision: false })), true);
});

test('publishing allows partial stage assignments but requires at least one when enabled', () => {
  assert.deepEqual(validateAiConfig(draft(), true), []);
  assert.equal(validateAiConfig({ ...draft(), bindings: emptyAiBindings() }, true).length, 1);
  assert.deepEqual(validateAiConfig({ ...draft(), enabled: false, bindings: emptyAiBindings() }, true), []);
});

test('publishing rejects missing keys or a stale binding to a removed profile', () => {
  assert.equal(validateAiConfig(draft(service({ hasApiKey: false })), true).length, 1);
  assert.deepEqual(validateAiConfig(draft(service({ hasApiKey: false, apiKey: 'test-key' })), true), []);
  assert.equal(validateAiConfig({ ...draft(), services: [] }, true).length, 1);
});

test('endpoint input rejects embedded credentials and query tokens', () => {
  for (const baseUrl of [
    'https://user:password@example.com/v1',
    'https://example.com?key=test',
    'ftp://example.com',
    'https://example.com/#token'
  ]) {
    assert.ok(validateAiService(service({ baseUrl })).length > 0);
  }
  assert.deepEqual(validateAiService(service({ baseUrl: 'https://example.com/v1' })), []);
});

test('timeout bounds and duplicate profile IDs are rejected', () => {
  assert.ok(validateAiService(service({ timeoutMs: 0 })).length > 0);
  assert.ok(validateAiService(service({ timeoutMs: 1200001 })).length > 0);
  assert.ok(validateAiConfig({ ...draft(), services: [service(), service()] }).length > 0);
});

test('publish eligibility uses server content status, not independent revision counters', () => {
  const config: AdminAiConfig = {
    ...draft(),
    draftRevision: 9,
    publishedRevision: 2,
    hasUnpublishedChanges: false,
    publishedAt: null,
    encryptionReady: true
  };
  assert.equal(canPublishAiConfig(config, false), false);
  assert.equal(canPublishAiConfig({ ...config, hasUnpublishedChanges: true }, false), true);
  assert.equal(canPublishAiConfig({ ...config, hasUnpublishedChanges: true }, true), false);
  assert.equal(canPublishAiConfig(null, false), false);
});
