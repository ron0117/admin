/* eslint-disable prettier/prettier */
/** The global namespace for the app */
declare namespace App {
  /** Theme namespace */
  namespace Theme {
    type ColorPaletteNumber = import('@sa/color').ColorPaletteNumber;

    /** Theme setting */
    interface ThemeSetting {
      /** Theme scheme */
      themeScheme: UnionKey.ThemeScheme;
      /** grayscale mode */
      grayscale: boolean;
      /** colour weakness mode */
      colourWeakness: boolean;
      /** Whether to recommend color */
      recommendColor: boolean;
      /** Theme color */
      themeColor: string;
      /** Other color */
      otherColor: OtherColor;
      /** Whether info color is followed by the primary color */
      isInfoFollowPrimary: boolean;
      /** Reset cache strategy */
      resetCacheStrategy: UnionKey.ResetCacheStrategy;
      /** Layout */
      layout: {
        /** Layout mode */
        mode: UnionKey.ThemeLayoutMode;
        /** Scroll mode */
        scrollMode: UnionKey.ThemeScrollMode;
        /**
         * Whether to reverse the horizontal mix
         *
         * if true, the vertical child level menus in left and horizontal first level menus in top
         */
        reverseHorizontalMix: boolean;
      };
      /** Page */
      page: {
        /** Whether to show the page transition */
        animate: boolean;
        /** Page animate mode */
        animateMode: UnionKey.ThemePageAnimateMode;
      };
      /** Header */
      header: {
        /** Header height */
        height: number;
        /** Header breadcrumb */
        breadcrumb: {
          /** Whether to show the breadcrumb */
          visible: boolean;
          /** Whether to show the breadcrumb icon */
          showIcon: boolean;
        };
        /** Multilingual */
        multilingual: {
          /** Whether to show the multilingual */
          visible: boolean;
        };
        /** Global search */
        globalSearch: {
          /** Whether to show the global search */
          visible: boolean;
        };
      };
      /** Tab */
      tab: {
        /** Whether to show the tab */
        visible: boolean;
        /**
         * Whether to cache the tab
         *
         * If cache, the tabs will get from the local storage when the page is refreshed
         */
        cache: boolean;
        /** Tab height */
        height: number;
        /** Tab mode */
        mode: UnionKey.ThemeTabMode;
      };
      /** Fixed header and tab */
      fixedHeaderAndTab: boolean;
      /** Sider */
      sider: {
        /** Inverted sider */
        inverted: boolean;
        /** Sider width */
        width: number;
        /** Collapsed sider width */
        collapsedWidth: number;
        /** Sider width when the layout is 'vertical-mix' or 'horizontal-mix' */
        mixWidth: number;
        /** Collapsed sider width when the layout is 'vertical-mix' or 'horizontal-mix' */
        mixCollapsedWidth: number;
        /** Child menu width when the layout is 'vertical-mix' or 'horizontal-mix' */
        mixChildMenuWidth: number;
      };
      /** Footer */
      footer: {
        /** Whether to show the footer */
        visible: boolean;
        /** Whether fixed the footer */
        fixed: boolean;
        /** Footer height */
        height: number;
        /** Whether float the footer to the right when the layout is 'horizontal-mix' */
        right: boolean;
      };
      /** Watermark */
      watermark: {
        /** Whether to show the watermark */
        visible: boolean;
        /** Watermark text */
        text: string;
        /** Whether to use user name as watermark text */
        enableUserName: boolean;
      };
      /** define some theme settings tokens, will transform to css variables */
      tokens: {
        light: ThemeSettingToken;
        dark?: {
          [K in keyof ThemeSettingToken]?: Partial<ThemeSettingToken[K]>;
        };
      };
    }

    interface OtherColor {
      info: string;
      success: string;
      warning: string;
      error: string;
    }

    interface ThemeColor extends OtherColor {
      primary: string;
    }

    type ThemeColorKey = keyof ThemeColor;

    type ThemePaletteColor = {
      [key in ThemeColorKey | `${ThemeColorKey}-${ColorPaletteNumber}`]: string;
    };

    type BaseToken = Record<string, Record<string, string>>;

    interface ThemeSettingTokenColor {
      /** the progress bar color, if not set, will use the primary color */
      nprogress?: string;
      container: string;
      layout: string;
      inverted: string;
      'base-text': string;
    }

    interface ThemeSettingTokenBoxShadow {
      header: string;
      sider: string;
      tab: string;
    }

    interface ThemeSettingToken {
      colors: ThemeSettingTokenColor;
      boxShadow: ThemeSettingTokenBoxShadow;
    }

    type ThemeTokenColor = ThemePaletteColor & ThemeSettingTokenColor;

    /** Theme token CSS variables */
    type ThemeTokenCSSVars = {
      colors: ThemeTokenColor & { [key: string]: string };
      boxShadow: ThemeSettingTokenBoxShadow & { [key: string]: string };
    };
  }

  /** Global namespace */
  namespace Global {
    type VNode = import('vue').VNode;
    type RouteLocationNormalizedLoaded = import('vue-router').RouteLocationNormalizedLoaded;
    type RouteKey = import('@elegant-router/types').RouteKey;
    type RouteMap = import('@elegant-router/types').RouteMap;
    type RoutePath = import('@elegant-router/types').RoutePath;
    type LastLevelRouteKey = import('@elegant-router/types').LastLevelRouteKey;

    /** The global header props */
    interface HeaderProps {
      /** Whether to show the logo */
      showLogo?: boolean;
      /** Whether to show the menu toggler */
      showMenuToggler?: boolean;
      /** Whether to show the menu */
      showMenu?: boolean;
    }

    /** The global menu */
    type Menu = {
      /**
       * The menu key
       *
       * Equal to the route key
       */
      key: string;
      /** The menu label */
      label: string;
      /** The menu i18n key */
      i18nKey?: I18n.I18nKey | null;
      /** The route key */
      routeKey: RouteKey;
      /** The route path */
      routePath: RoutePath;
      /** The menu icon */
      icon?: () => VNode;
      /** The menu children */
      children?: Menu[];
    };

    type Breadcrumb = Omit<Menu, 'children'> & {
      options?: Breadcrumb[];
    };

    /** Tab route */
    type TabRoute = Pick<RouteLocationNormalizedLoaded, 'name' | 'path' | 'meta'> &
      Partial<Pick<RouteLocationNormalizedLoaded, 'fullPath' | 'query' | 'matched'>>;

    /** The global tab */
    type Tab = {
      /** The tab id */
      id: string;
      /** The tab label */
      label: string;
      /**
       * The new tab label
       *
       * If set, the tab label will be replaced by this value
       */
      newLabel?: string;
      /**
       * The old tab label
       *
       * when reset the tab label, the tab label will be replaced by this value
       */
      oldLabel?: string;
      /** The tab route key */
      routeKey: LastLevelRouteKey;
      /** The tab route path */
      routePath: RouteMap[LastLevelRouteKey];
      /** The tab route full path */
      fullPath: string;
      /** The tab fixed index */
      fixedIndex?: number | null;
      /**
       * Tab icon
       *
       * Iconify icon
       */
      icon?: string;
      /**
       * Tab local icon
       *
       * Local icon
       */
      localIcon?: string;
      /** I18n key */
      i18nKey?: I18n.I18nKey | null;
    };

    /** Form rule */
    type FormRule = import('element-plus').FormItemRule;

    /** The global dropdown key */
    type DropdownKey = 'closeCurrent' | 'closeOther' | 'closeLeft' | 'closeRight' | 'closeAll';
  }

  /**
   * I18n namespace
   *
   * Locales type
   */
  namespace I18n {
    type RouteKey = import('@elegant-router/types').RouteKey;

    type LangType = 'en-us' | 'zh-cn' | 'zh-tw';

    type LangOption = {
      label: string;
      key: LangType;
    };

    type I18nRouteKey = Exclude<RouteKey, 'root' | 'not-found'>;

    type FormMsg = {
      required: string;
      invalid: string;
    };

    type Schema = {
      errorMessage: {
        [key: string]: string;
      };
      system: {
        title: string;
        updateTitle: string;
        updateContent: string;
        updateConfirm: string;
        updateCancel: string;
      };
      common: {
        action: string;
        read: string;
        add: string;
        view: string;
        addSuccess: string;
        backToHome: string;
        batchDelete: string;
        cancel: string;
        open: string;
        close: string;
        check: string;
        expandColumn: string;
        columnSetting: string;
        config: string;
        confirm: string;
        paste: string;
        delete: string;
        deleteSuccess: string;
        confirmDelete: string;
        edit: string;
        warning: string;
        error: string;
        index: string;
        keywordSearch: string;
        logout: string;
        logoutConfirm: string;
        lookForward: string;
        modify: string;
        modifySuccess: string;
        noData: string;
        note: string;
        noPrivilege: string;
        operate: string;
        pleaseCheckValue: string;
        pleaseSelectPrivileges: string;
        refresh: string;
        reset: string;
        selectAll: string;
        save: string;
        search: string;
        switch: string;
        tip: string;
        trigger: string;
        update: string;
        updateSuccess: string;
        updateFailed: string;
        addFailed: string;
        userCenter: string;
        status: string;
        startImport: string;
        startExport: string;
        disable: string;
        enable: string;
        recover: string;
        copy: string;
        detail: string;
        remove: string;
        member: {
          id: string;
          account: string;
          nickname: string;
        };
        shop: {
          id: string;
          account: string;
          name: string;
        };
        yesOrNo: {
          yes: string;
          no: string;
        };
        game: {
          category: string;
          id: string;
          name: string;
        };
        gameType: {
          all: string;
          '-1': string;
          slot: string;
          video: string;
          chess: string;
          pachinko: string;
          fish: string;
          electronic: string;
        };
        lang: {
          'zh-cn': string;
          'zh-tw': string;
          'en-us': string;
        };
        time: string;
        timeRangeRequired: string;
        beforeModify: string;
        afterModify: string;
        operator: string;
        noChange: string;
        getSuccess: string;
        requestFailed: string;
        import: string;
        export: string;
        batchProgress: {
          title: string;
          processList: string;
          successCount: string;
          failedTitle: string;
          retry: string;
          retryConfirm: string;
          taskType: {
            gameTemplatePublish: string;
          };
        };
        fileIO: {
          exportFile: string;
          importFile: string;
          exportData: string;
          fileName: string;
          fileFormat: string;
          selectFile: string;
          delimiter: string;
          encoding: string;
          hasHeader: string;
          useJsonFormat: string;
          pleaseInputFileName: string;
          pleaseSelectFileFormat: string;
          pleaseSelectDelimiter: string;
          pleaseSelectEncoding: string;
          pleaseSelectFile: string;
          firstRowIsHeader: string;
          useJsonFormatTip: string;
          fileSelected: string;
          pleaseSelectFileFirst: string;
          noDataInFile: string;
          noDataToExport: string;
          unsupportedFormat: string;
          importSuccess: string;
          importFailed: string;
          exportSuccess: string;
          exportFailed: string;
          willExportCount: string;
          fileInfo: string;
          jsonFormatTip: string;
          formatOptions: {
            xlsx: string;
            xls: string;
            csv: string;
            txt: string;
            json: string;
          };
          delimiterOptions: {
            comma: string;
            semicolon: string;
            tab: string;
            space: string;
            pipe: string;
          };
        };
        startTime: string;
        endTime: string;
        searchFailed: string;
        total: string;
      };
      request: {
        logout: string;
        logoutMsg: string;
        logoutWithModal: string;
        logoutWithModalMsg: string;
        refreshToken: string;
        tokenExpired: string;
      };
      theme: {
        themeSchema: { title: string } & Record<UnionKey.ThemeScheme, string>;
        grayscale: string;
        colourWeakness: string;
        layoutMode: { title: string; reverseHorizontalMix: string } & Record<UnionKey.ThemeLayoutMode, string>;
        recommendColor: string;
        recommendColorDesc: string;
        themeColor: {
          title: string;
          followPrimary: string;
        } & Theme.ThemeColor;
        scrollMode: { title: string } & Record<UnionKey.ThemeScrollMode, string>;
        page: {
          animate: string;
          mode: { title: string } & Record<UnionKey.ThemePageAnimateMode, string>;
        };
        fixedHeaderAndTab: string;
        header: {
          height: string;
          breadcrumb: {
            visible: string;
            showIcon: string;
          };
          multilingual: {
            visible: string;
          };
          globalSearch: {
            visible: string;
          };
        };
        tab: {
          visible: string;
          cache: string;
          height: string;
          mode: { title: string } & Record<UnionKey.ThemeTabMode, string>;
        };
        sider: {
          inverted: string;
          width: string;
          collapsedWidth: string;
          mixWidth: string;
          mixCollapsedWidth: string;
          mixChildMenuWidth: string;
        };
        footer: {
          visible: string;
          fixed: string;
          height: string;
          right: string;
        };
        watermark: {
          visible: string;
          text: string;
          enableUserName: string;
        };
        themeDrawerTitle: string;
        pageFunTitle: string;
        resetCacheStrategy: { title: string } & Record<UnionKey.ResetCacheStrategy, string>;
        configOperation: {
          copyConfig: string;
          copySuccessMsg: string;
          resetConfig: string;
          resetSuccessMsg: string;
        };
      };
      route: Record<I18nRouteKey, string>;
      page: {
        login: {
          common: {
            loginOrRegister: string;
            userNamePlaceholder: string;
            passwordPlaceholder: string;
            confirmPasswordPlaceholder: string;
            confirm: string;
            back: string;
            validateSuccess: string;
            loginSuccess: string;
            welcomeBack: string;
          };
          pwdLogin: {
            title: string;
          };
        };
        bo: {
          role: {
            roleListTitle: string;
            dataCompilation: string;
            dataWorkup: string;
            historyData: string;
            lastData: string;
            saveRoleWarningInfo: string;
            readSetting: string;
            editSetting: string;
            haveNoButtonsPrivilegesSetting: string;
            pleaseCheckPrivilegesSetting: string;
            needEnterRoleName: string;
            addNewRole: string;
            updateRole: string;
            copyRole: string;
            roleName: string;
            needEnterNote: string;
            readSelectAll: string;
            editSelectAll: string;
            readReset: string;
            editReset: string;
            createdAt: string;
          };
          user: {
            name: string;
            hierarchy: string;
            role: string;
            email: string;
            createdAt: string;
            status: string;
            password: string;
            disableMessage: string;
            enableMessage: string;
            roleName: string;
            lsidRequired: string;
            lsid: string;
            jpkDsn: string;
            atgOfflineBetGroup: string;
            atgOnlineBetGroup: string;
            onlineBetGroup: string;
            offlineBetGroup: string;
            onlineBetGroupPlaceholder: string;
            offlineBetGroupPlaceholder: string;
            statusActive: string;
            statusInactive: string;
            rtp: string;
            rtpRange: string;
            winLimit: string;
            rsgBetUpperLimit: string;
            rsgBetLowerLimit: string;
            rsgBetRangeInvalid: string;
            rsgBetRangeBothRequired: string;
          },
          bound: {
            batch: string,
            name: string,
            boundAt: string,
            remark: string,
            status: string,
            bound: string,
            unbound: string,
            keyword: string,
            system: string,
            proxy: string,
            store: string,
            boundSuccess: string,
            releaseSuccess: string,
            storeMessage: string,
            proxyMessage: string
          }
        };
        home: {
          greeting: string;
          contentInfo: {
            welcome: string;
            detail: string;
          };
        };
        manage: {
          common: {
            status: {
              enable: string;
              disable: string;
            };
          };
          role: {
            title: string;
            roleName: string;
            roleCode: string;
            roleStatus: string;
            roleDesc: string;
            keyword: string;
            createdAt: string;
            statusActive: string;
            statusDisabled: string;
            confirmDisable: string;
            confirmEnable: string;
            configureMenus: string;
            menusHint: string;
            form: {
              roleName: string;
              roleCode: string;
              roleStatus: string;
              roleDesc: string;
            };
            addRole: string;
            editRole: string;
            menuAuth: string;
            buttonAuth: string;
          };
          user: {
            title: string;
            userName: string;
            userGender: string;
            nickName: string;
            userPhone: string;
            userEmail: string;
            userStatus: string;
            userRole: string;
            form: {
              userName: string;
              userGender: string;
              nickName: string;
              userPhone: string;
              userEmail: string;
              userStatus: string;
              userRole: string;
            };
            addUser: string;
            editUser: string;
            resetPassword: string;
            createdAt: string;
            keyword: string;
            activate: string;
            confirmDisable: string;
            confirmEnable: string;
            password: string;
            roleUser: string;
            roleAdmin: string;
            statusPending: string;
            statusActive: string;
            statusDisabled: string;
            gender: {
              male: string;
              female: string;
            };
          };
          admin: {
            title: string;
            userName: string;
            userEmail: string;
            userStatus: string;
            form: {
              userName: string;
              userEmail: string;
            };
            addUser: string;
            editUser: string;
            resetPassword: string;
            createdAt: string;
            keyword: string;
            confirmDisable: string;
            confirmEnable: string;
            password: string;
            statusActive: string;
            statusDisabled: string;
          };
          menu: {
            home: string;
            title: string;
            id: string;
            parentId: string;
            menuType: string;
            menuName: string;
            routeName: string;
            routePath: string;
            pathParam: string;
            layout: string;
            page: string;
            i18nKey: string;
            icon: string;
            localIcon: string;
            iconTypeTitle: string;
            order: string;
            constant: string;
            keepAlive: string;
            href: string;
            hideInMenu: string;
            activeMenu: string;
            multiTab: string;
            fixedIndexInTab: string;
            query: string;
            button: string;
            buttonCode: string;
            buttonDesc: string;
            menuStatus: string;
            form: {
              home: string;
              menuType: string;
              menuName: string;
              routeName: string;
              routePath: string;
              pathParam: string;
              layout: string;
              page: string;
              i18nKey: string;
              icon: string;
              localIcon: string;
              order: string;
              keepAlive: string;
              href: string;
              hideInMenu: string;
              activeMenu: string;
              multiTab: string;
              fixedInTab: string;
              fixedIndexInTab: string;
              queryKey: string;
              queryValue: string;
              button: string;
              buttonCode: string;
              buttonDesc: string;
              menuStatus: string;
            };
            addMenu: string;
            editMenu: string;
            addChildMenu: string;
            type: {
              directory: string;
              menu: string;
            };
            iconType: {
              iconify: string;
              local: string;
            };
          };
        };
        points: {
          settings: {
            title: string;
            feature: string;
            featureName: string;
            menuCode: string;
            points: string;
            remark: string;
            updatedAt: string;
            editTitle: string;
            unitPoints: string;
            unitHigh: string;
            unitMedium: string;
            unitGood: string;
            unitInvalid: string;
            remarkMax: string;
            priceHint: string;
            liveSummary: string;
            defaultSummary: string;
          };
          records: {
            title: string;
            user: string;
            userPlaceholder: string;
            type: string;
            feature: string;
            featureSpec: string;
            status: string;
            time: string;
            quantity: string;
            delta: string;
            balanceAfter: string;
            requestId: string;
            remark: string;
            typeConsume: string;
            typeRefund: string;
            typeIncrease: string;
            typeDecrease: string;
            statusPending: string;
            statusCompleted: string;
            statusRefunded: string;
            copyId: string;
            copySuccess: string;
            copyFailed: string;
          };
          menu: {
            inspire: string;
            fission: string;
            sceneRenew: string;
            free: string;
            live: string;
            copywrite: string;
          };
          user: {
            points: string;
            adjust: string;
            direction: string;
            increase: string;
            decrease: string;
            amount: string;
            remark: string;
            amountInvalid: string;
            remarkRequired: string;
          };
        };
        game: {
          set: {
            set: string;
            category: string;
            gameName: string;
            gameBrand: string;
            title: string;
            group: string;
            gameId: string;
            gameIcon: string;
            machineCount: string;
            clickToView: string;
            setParams: string;
            gameSmallIcon: string;
            gameBigIcon: string;
            provider: {
              label: string;
              ag: string;
              tb: string;
              agfish: string;
              evo: string;
              ab: string;
              atg: string;
              rsg: string;
              wow: string;
            };
            atgGameCodeTip: string;
            gameSupplierId: string;
            subProvider: {
              ag_slot: string;
              ag_video: string;
              ag_fish: string;
              tb_chess: string;
              tb_fish: string;
              evo: string;
              ab: string;
              atg: string;
              rsg: string;
              wow: string;
            };
            providerGameId: string;
            deputyAward: string;
            awardType: {
              bb: string;
              rb: string;
              sb: string;
            };
            machineCard: {
              title: string;
              normal: string;
              gold: string;
              diamond: string;
              vip: string;
              generally: string;
            };
            machineStatus: {
              title: string;
              free: string;
              online: string;
              retained: string;
            };
            remainingTime: string;
            cancelReserve: string;
            extendReserve: string;
            kickOutGame: string;
            kickOutGameConfirm: string;
            cancelReserveConfirm: string;
            isWebGame: string;
            entrySetting: {
              title: string;
              hall: string;
              table: string;
              area: string;
              game: string;
            };
            newbieTable: string;
            immediatePlaySetting: {
              title: string;
              hallEntry: string;
              categoryEntry: string;
              tableEntry: string;
            };
            skins: {
              tips: string;
              title: string;
              skin1: string;
              skin2: string;
              skin3: string;
            };
            evoCategory: string;
            pointRatio: {
              title: string;
              placeholder: string;
              one: string;
            };
            probability: string;
            getNewFeature: string;
            featureGameName: string;
            featureGame: string;
            playSwitch: string;
            sellMultiple: string;
            extraBet: string;
            shakeSetting: string;
            playerBet: string;
            importGameData: string;
            exportGameData: string;
            additionalA: string;
            additionalB: string;
            featureModule: string;
            star: string;
            buyFeatureText: string;
            buyFeatureTextTips: string;
            maxEnableFeatureCount: string;
            abTips: string;
          };
          platform: {
            platform: string;
            test: string;
            formal: string;
            shop: string;
            bindPlatform: string;
            pleaseSelectBindPlatform: string;
            withBonus: string;
            withoutBonus: string;
            status: string;
            show: string;
            hide: string;
            publish: string;
            batchPublish: string;
            cancelPublish: string;
            publishSuccess: string;
            importFailed: string;
            importCurrentDataEmpty: string;
            importClientTypeMismatch: string;
            importPleaseSearchFirst: string;
            pleaseSelectStore: string;
            effectiveTime: {
              title: string;
              placeholder: string;
              immediate: string;
              specified: string;
              cannotBeforeNow: string;
            };
            setup: string;
            gameStatus: string;
            isPopular: string;
            index: string;
            top: string;
            bottom: string;
            normal: string;
            cancelTop: string;
            cancelBottom: string;
            topSuccess: string;
            bottomSuccess: string;
            cancelLayerSuccess: string;
            saveSuccess: string;
            statusChangeSuccess: string;
            dragSuccess: string;
            latest: string;
            activity: string;
            hot: string;
            jp: string;
            expectedTime: string;
            hideAll: string;
            showAll: string;
            /** 编辑时列表无测试数据 */
            noTestData: string;
            /** 跨置顶/普通/置底拖拽提示 */
            dragSameLayerOnly: string;
          };
          template: {
            title: string;
            templateId: string;
            templateName: string;
            templateNameRequired: string;
            bindPlatform: string;
            platformType: string;
            templateStatus: string;
            relatedStores: string;
            displayGameCount: string;
            popularGame: string;
            operateTime: string;
            status: string;
            published: string;
            unpublished: string;
            withBonus: string;
            withoutBonus: string;
            addTitle: string;
            editTitle: string;
            viewTitle: string;
            save: string;
            saveSuccess: string;
            publishTemplate: string;
            pleaseLoadGameList: string;
            pleaseSelectPlatformType: string;
            batchPublishStores: string;
            proxyFilter: string;
            saveMap: string;
            saveMapSuccess: string;
            publishSuccess: string;
            pleaseSelectStore: string;
            missingTemplateId: string;
            pleaseSaveBeforePublish: string;
            publishProgress: string;
            publishInProgress: string;
            deleteConfirm: string;
            back: string;
          };
          recordQuery: {
            title: string;
            record: string;
            summary: string;
            /** 游戏记录总表：代理搜索前须选择店家 */
            pleaseSelectStore: string;
            /** 游戏记录总表：按游戏维度查询开关标签 */
            summaryQueryByGame: string;
            /** 请选择厂牌 */
            pleaseSelectBrand: string;
            /** 请选择分类 */
            pleaseSelectCategory: string;
            /** 请选择游戏 */
            pleaseSelectGame: string;
          };
          jackpot: {
            jackpotReport: string;
            store: string;
            enterStore: string;
            winTime: string;
            gameTime: string;
            startTime: string;
            endTime: string;
            userId: string;
            nickname: string;
            machineNo: string;
            jackpotLevel: string;
            winnings: string;
            minBet: string;
            gameType: string;
            gameId: string;
            gameName: string;
            timestamp: string;
            to: string;
          },
          brand: {
            /** Tab 标题：游戏厂牌设置 */
            title: string;
            /** 占位说明（列表与表单在后续任务实现） */
            emptyHint: string;
            formBrandName: string;
            formIcons: string;
            formIconsNew: string;
            formSort: string;
            formStatus: string;
            statusEnabled: string;
            statusDisabled: string;
            dialogAddTitle: string;
            dialogEditTitle: string;
            /** 查看厂牌弹窗标题 */
            dialogViewTitle: string;
            /** 列表列：最后修改者 */
            lastEditor: string;
            /** 列表列：最后修改时间 */
            updateTime: string;
          },
          marquee: {
            marquee: string;
            fetchFailed: string;
            updateFailed: string;
            updateSuccess: string;
            dialogTitle: string;
            alertTitle: string;
            displayCondition: string;
            moduleContent: string;
            multiplier: string;
            winScore: string;
            english: string;
            traditionalChinese: string;
            simplifiedChinese: string;
            bigWin: string;
          };
          standby: {
            title: string;
            displayTime: string;
            activityTime: string;
            createdAt: string;
            formName: string;
            formImage: string;
            formSort: string;
            operator: string;
            statusOnline: string;
            statusPending: string;
            statusOffline: string;
            statusExpired: string;
            dialogAddTitle: string;
            dialogEditTitle: string;
            dialogViewTitle: string;
            offlineConfirm: string;
            deleteConfirm: string;
            offline: string;
            storeSetting: string;
          };
        };
        member: {
          quickPreview: {
            title: string;
            generateAccount: string;
            editAccount: string;
            bindStore: string;
            bindPlatform: string;
            memberPassword: string;
            memberNickname: string;
            depositWithdraw: string;
            money: string;
            lastInPoint: string;
            lastOutPoint: string;
            toggleStatus: string;
            toggleStatusDisable: string;
            toggleStatusConfirm: {
              enable: string;
              disable: string;
            };
            editMachineNumber: string;
            form: {
              account: string;
              password: string;
              nickname: string;
              machineNumber: string;
              machineNumberRequired: string;
              pleaseInputMachineNumber: string;
              pleaseSelectStore: string;
              pleaseInputAccount: string;
              pleaseInputPassword: string;
              pleaseInputNickname: string;
              pleaseSelectPlatform: string;
              accountLengthError: string;
              accountFormatError: string;
              passwordLengthError: string;
              passwordUniqueCharsError: string;
              passwordLetterError: string;
              passwordNumberError: string;
              passwordContainsAccountError: string;
              nicknameLengthError: string;
              nicknameFormatError: string;
            };
            depositWithdrawModal: {
              title: string;
              currentMoney: string;
              operationType: string;
              inPoint: string;
              outPoint: string;
              amount: string;
              pleaseInputAmount: string;
              afterModifyMoney: string;
              amountMustBePositive: string;
              amountExceedsBalance: string;
              confirmMessage: string;
            };
            platform: {
              crKing: string;
              slotKing: string;
              '588WithBonus': string;
              '588NoBonus': string;
            };
            forgetPassword: string;
            forgetPasswordModal: {
              title: string;
              password: string;
              confirmPassword: string;
              pleaseInputPassword: string;
              pleaseInputConfirmPassword: string;
              passwordNotMatch: string;
            };
            account: string;
          };
          basic: {
            game: string;
            pleaseSearchMemberFirst: string;
            singleQuery: string;
            store: string;
            pleaseSelectMachineNumber: string;
            gameRecord: {
              title: string;
              tableTitle: string;
              dataRefreshInfo: string;
              time: string;
              gameName: string;
              pointRatio: string;
              machineNumber: string;
              orderNumber: string;
              gameMode: string;
              gameModeFg: string;
              gameModeNg: string;
              betAmount: string;
              winAmount: string;
              totalWinLoss: string;
              balance: string;
              reviewRoom: string;
              reviewRoomButton: string;
              userIdRequired: string;
              otherInfo: string;
              gameHall: string;
              betAmountWithPre: string;
              totalWinWithPre: string;
              rtp: string;
              gameCategory: string;
              gameNameCategory: string;
              gameNameCategoryPlaceholder: string;
              electronic: {
                vip: string;
              };
              disconnection: string;
              gameAward: string;
              coinBet: string;
              extraBet: string;
              buyFeature: string;
              itemBet: string;
              gameWinAmount: string;
              jackpotWinAmount: string;
              rsgJackpotType: {
                grand: string;
                major: string;
                minor: string;
                mini: string;
              };
              detail: string;
              noReplayUrl: string;
            };
            gameSummary: {
              title: string;
              tableTitle: string;
              period: string;
              categoryType: {
                all: string;
                gameCategory: string;
                gameName: string;
              };
              gameType: string;
              category: string;
              categoryName: string;
              betCount: string;
              totalBetAmount: string;
              totalWinAmount: string;
              totalValidBet: string;
              totalRebate: string;
              netProfit: string;
              rtp: string;
              gameCategory: string;
              gameName: string;
              individualWinLoss: string;
              totalCategoryProfit: string;
              details: string;
              totalBetCategory: string;
              totalWinCategory: string;
              /** 游戏厂牌列 */
              gameBrand: string;
              /** 厂牌总押注 */
              totalBetBrand: string;
              /** 厂牌总赢分 */
              totalWinBrand: string;
              /** 厂牌总输赢 */
              totalBrandProfit: string;
              gameIndividualBet: string;
              gameIndividualWin: string;
              storeLabel: string;
            };
            passbook: {
              title: string;
              tableTitle: string;
              project: string;
              memberOrTargetName: string;
              transactionTime: string;
              orderNumber: string;
              transactionParty: string;
              expense: string;
              income: string;
              balance: string;
              remark: string;
              all: string;
              deposit: string;
              withdraw: string;
              game: string;
              transfer: string;
              other: string;
            };
          };
          control: {
            test: {
              title: string;
              tableTitle: string;
              member: string;
              memberId: string;
              memberNickname: string;
              memberAccount: string;
              description: string;
              updatedAt: string;
              operator: string;
              cancelTestList: string;
              downloadTemplate: string;
              templateHeader: string;
              templateFileName: string;
              message: {
                pleaseInputMemberId: string;
                invalidMemberId: string;
                pleaseSelectFile: string;
                fileTooLarge: string;
                noValidMemberId: string;
              };
            };
          };
        };
        system: {
          setting: {
            boUserID: string;
            category: string;
            name: string;
            value: string;
            comment: string;
            shared: string;
            modificationTime: string;
            detail: string;
            systemConfig: {
              tips: string;
            };
          };
          gameMaintain: {
            gameSwitch: string;
            setting: string;
            record: string;
            setExecuteTime: string;
            executeTime: string;
            search: string;
            operationTime: string;
            scheduleSetting: string;
            settingItems: string;
            adminName: string;
            operation: string;
            open: string;
            maintain: string;
            refresh: string;
            isOpenNow: string;
            isMaintainNow: string;
            isHave: string;
            toMaintain: string;
            toOpen: string;
            stop: string;
            start: string;
            isDelete: string;
            cancel: string;
            pleaseSelectExecuteTime: string;
            executeTimeRuleTip: string;
            pleaseSelectGame: string;
            operationType: string;
            scheduleSwitchTime: string;
            exportOperationLog: string;
            pachinkoTip: string;
            operator: string;
            slot: string;
            video: string;
            chess: string;
            electronic: string;
            pachinko: string;
            fish: string;
          };
          maintain: {
            tester: string;
            udid: string;
            createdAt: string;
            comment: string;
            operation: string;
            searchUserUdid: string;
          };
          sync: {
            store: string;
            date: string;
            syncBtn: string;
            syncSuccess: string;
          };
          storeMaintain: {
            storeName: string;
            mode: string;
            modeManual: string;
            modeAuto: string;
            countDown: string;
            updatedBy: string;
            cycleTip: string;
          };
          testTool: {
            kick: string;
            machineId: string;
            gameId: string;
            userId: string;
            kickConfirm: string;
            kickPlayer: string;
            clearSeat: string;
            clearSeatConfirm: string;
            clearSeatTip: string;
            userIdRequired: string;
          };
        };
        announce: {
          marquee: {
            title: string;
            content: string;
            startTime: string;
            endTime: string;
            displayTime: string;
            status: string;
            creator: string;
            dialogAddTitle: string;
            dialogEditTitle: string;
            deleteConfirm: string;
            statusPending: string;
            statusRunning: string;
            statusFinished: string;
          };
          standby: {
            title: string;
            storeName: string;
            enabled: string;
            carousel: string;
          };
        };
        cash: {
          report: {
            orderTime: string;
            proxy: string;
            /** 店家对外展示编号（如 displayId） */
            storeDisplayId: string;
            store: string;
            allMembers: string;
            member: string;
            machineNumber: string;
            /** 机台查询：机台号为必选时的提示 */
            machineNumberRequired: string;
            /** 代理商联动后无店家可选时的提示 */
            noStoresUnderProxy: string;
            keyIn: string;
            billIn: string;
            backendIn: string;
            keyOut: string;
            backendOut: string;
            cardIn: string;
            cardOut: string;
            burstKo: string;
            remark: string;
            metaSwallow: string;
            metaReturn: string;
            machineRevenue: string;
            storeRevenue: string;
            totalRevenue: string;
            /** 台面余额 */
            balance: string;
            summary: {
              transferIn: string;
              transferOut: string;
              revenue: string;
              /** 店家实收 − 台面余额（多选店家总表末列） */
              rowSum: string;
            };
            /** 金流报表页内 Tab（路由仅 /cash/report，多层级用 Tab 承载） */
            tabs: {
              storeQuery: string;
              machineQuery: string;
              ledger: string;
              summary: string;
            };
          };
          ioConfig: {
            ioConfig: string;
            keyin: string;
            keyinUnit: string;
            keyinUnitBig: string;
            keyout: string;
            keyoutUnit: string;
            brustConfig: string;
            brustSetting: string;
            upperLimit: string;
            upperLimitRequired: string;
            upperLimitPlaceholder: string;
          };
        };
      };
      form: {
        required: string;
        placeholder: string;
        select: string;
        userName: FormMsg;
        phone: FormMsg;
        pwd: FormMsg;
        confirmPwd: FormMsg;
        code: FormMsg;
        email: FormMsg;
        keyword: FormMsg;
        gameId: FormMsg;
        positiveInteger: FormMsg;
      };
      dropdown: Record<Global.DropdownKey, string>;
      icon: {
        themeConfig: string;
        themeSchema: string;
        lang: string;
        fullscreen: string;
        fullscreenExit: string;
        reload: string;
        collapse: string;
        expand: string;
        pin: string;
        unpin: string;
      };
      datatable: {
        itemCount: string;
      };
    };

    type GetI18nKey<T extends Record<string, unknown>, K extends keyof T = keyof T> = K extends string
      ? T[K] extends Record<string, unknown>
      ? `${K}.${GetI18nKey<T[K]>}`
      : K
      : never;

    type I18nKey = GetI18nKey<Schema>;

    type TranslateOptions<Locales extends string> = import('vue-i18n').TranslateOptions<Locales>;

    interface $T {
      (key: I18nKey): string;
      (key: I18nKey, plural: number, options?: TranslateOptions<LangType>): string;
      (key: I18nKey, defaultMsg: string, options?: TranslateOptions<I18nKey>): string;
      (key: I18nKey, list: unknown[], options?: TranslateOptions<I18nKey>): string;
      (key: I18nKey, list: unknown[], plural: number): string;
      (key: I18nKey, list: unknown[], defaultMsg: string): string;
      (key: I18nKey, named: Record<string, unknown>, options?: TranslateOptions<LangType>): string;
      (key: I18nKey, named: Record<string, unknown>, plural: number): string;
      (key: I18nKey, named: Record<string, unknown>, defaultMsg: string): string;
    }
  }

  /** Service namespace */
  namespace Service {
    /** Other baseURL key */
    type OtherBaseURLKey = 'demo';

    interface ServiceConfigItem {
      /** The backend service base url */
      baseURL: string;
      /** The proxy pattern of the backend service base url */
      proxyPattern: string;
    }

    interface OtherServiceConfigItem extends ServiceConfigItem {
      key: OtherBaseURLKey;
    }

    /** The backend service config */
    interface ServiceConfig extends ServiceConfigItem {
      /** Other backend service config */
      other: OtherServiceConfigItem[];
    }

    interface SimpleServiceConfig extends Pick<ServiceConfigItem, 'baseURL'> {
      other: Record<OtherBaseURLKey, string>;
    }

    /** 接口返回的数据里，正常的时候会返回data，错误的时候会返回message */
    type Response<T = unknown> = {
      code: number;
      status: string;
    } & (
        | { data: T; message?: string }
        | { data?: T; message: string }
      );


    /** The demo backend service response data */
    type DemoResponse<T = unknown> = {
      /** The backend service response code */
      status: string;
      /** The backend service response message */
      message: string;
      /** The backend service response data */
      result: T;
    };
  }

  /** 组件操作数据类型定义 */
  namespace Component {
    type RoleDialog = {
      /** 组件是否显示 */
      visible: boolean;
      /** 组件操作状态 */
      handleType: 'add' | 'update' | 'copy';
    }
  }


}
