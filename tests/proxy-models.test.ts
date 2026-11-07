import assert from 'node:assert/strict';
import test from 'node:test';
import { allowManualProxyModel, proxyModelIdError, proxyModelStale } from '../src/utils/proxy-models';

test('目录里有当前值时只用下拉', () => {
  assert.equal(allowManualProxyModel(['gpt-6.1-sol', 'gpt-image-2'], 'gpt-6.1-sol'), false);
  assert.equal(proxyModelStale(['gpt-6.1-sol'], 'gpt-6.1-sol'), false);
});

test('列表为空或当前值不在列表里时允许手填，并标出不在最新列表中', () => {
  assert.equal(allowManualProxyModel([], 'gpt-6.1-sol'), true);
  assert.equal(proxyModelStale([], 'gpt-6.1-sol'), true);
  assert.equal(allowManualProxyModel(['other'], 'gpt-6.1-sol'), true);
  assert.equal(proxyModelStale(['other'], '  '), false);
});

test('空白和超长模型名不能保存', () => {
  assert.match(proxyModelIdError('bad id', '生文模型') || '', /不能包含空白/);
  assert.equal(proxyModelIdError('gpt-6.1-sol', '生文模型'), null);
});
