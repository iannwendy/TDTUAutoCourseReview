declare namespace chrome {
  namespace storage {
    namespace sync {
      function get(keys: string | string[] | null, callback: (result: any) => void): void;
      function set(items: any, callback?: () => void): void;
    }
    namespace session {
      function get(keys: string | string[] | null, callback: (result: any) => void): void;
      function set(items: any, callback?: () => void): void;
    }
    namespace local {
      function get(keys: string | string[] | null, callback: (result: any) => void): void;
      function set(items: any, callback?: () => void): void;
    }
  }

  namespace tabs {
    interface Tab {
      id?: number;
      url?: string;
      title?: string;
    }

    function query(queryInfo: any, callback: (tabs: any[]) => void): void;
    function sendMessage(tabId: number, message: any, callback?: (response: any) => void): void;
    function create(createProperties: { url: string }): void;
  }

  namespace runtime {
    function sendMessage(message: any, callback?: (response: any) => void): void;
    const onMessage: {
      addListener(callback: (message: any, sender: any, sendResponse: (response: any) => void) => void): void;
      removeListener(callback: (message: any, sender: any, sendResponse: (response: any) => void) => void): void;
    };
    const lastError: any;
  }
} 