declare namespace Api {
  namespace SystemSync {
    type SyncJpkReq = {
      lsid: number[];
      startAt: string;
      endAt: string;
    };
  }
}
