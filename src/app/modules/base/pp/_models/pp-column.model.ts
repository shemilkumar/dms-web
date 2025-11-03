import { Sort } from "@angular/material/sort";

export enum PPColumnType {
    "TEXT" = "TEXT",
    "TAG_LIST" = "TAG_LIST",
    "ACTIONS" = "ACTIONS",
}

export interface PPColumn {
    id: string;
    label?: string;
    headerClass?: string | string[];
    extraHeaderClass?: string | string[];
    cellClass?: string | string[];
    style?: string;
    extraHeaderStyle?: string;
    sortable?: boolean;
    type?: PPColumnType;
    config?: any;
    labelClass?: string;
    hidden?: boolean;
    colspan?: number;
}


export interface PPTableConfig {
    id: string;
    rowSelectEnabled?: boolean;
    actions?: PPActions;
    showExtraHeader?: boolean;
    extraHeader?: {
        class?: string[];
        style?: string;
    }
    page?: {
        pageSize?: number;
        pageIndex?: number;
        length?: number | null;
    };
    translateKey?: string;
    translate?: boolean;
    paginator?: {
        offline?: boolean;
        hide?: boolean;
    };
    isActive?: Function;
    sort?: Sort;
    default?: boolean;
    footer?: {
        colspan?: number;
        style?: string;
        class?: string[];
    };
    tableState?: TableState;
}

export enum TableState {
    LOADING = "LOADING",
    DEFAULT = "DEFAULT",
    SUCCESS = "SUCCESS",
    NO_DATA = "NO_DATA",
    FAILURE = "FAILURE"
}

export interface PPActions {
    headerLabel?: string;
    header?: {
        style?: string;
        class?: string[];
    };
    style?: string;
    class?: string[];
    show?: boolean;
    contentSelector?: string;
}
