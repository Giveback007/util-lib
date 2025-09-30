import { Dict } from "./@types";
import { isType } from "./test";
import { twMerge as _twMerge  } from "tailwind-merge";

type StorageType = 'localStorage' | 'sessionStorage';

function storageFactory(type: StorageType) {
    return {
        hasStore: () => !!(typeof window !== "undefined" && window[type]),
        get: <T = any>(key: string) => JSON.parse(window[type].getItem(key) ?? 'null') as T | null,
        set: (key: string, data: any) => window[type].setItem(key, JSON.stringify(data)),
        del: (key: string) => window[type].removeItem(key),
    }
}

export const lStore = storageFactory('localStorage');
export const sStore = storageFactory('sessionStorage');

export type ClassNameArray = ClassNameValue[];
export type ClassNameValue = ClassNameArray | string | null | undefined | 0 | 0n | false;
export type CssMergeArgs = Dict<any> | ClassNameValue | ClassNameValue[];

export function twMerge(...cssArgs: CssMergeArgs[]): string {
    // @ts-ignore
    cssArgs = Array.isArray(cssArgs) ? cssArgs.flat(Infinity) : cssArgs;
    const classes: ClassNameValue[] = [];

    for (let css of cssArgs) {
        if (isType(css, 'object')) {
            Object.entries(css).forEach(([cls, truthy]) => {
                if (truthy) classes.push(cls);
            });
        } else if (css) {
            classes.push(css)
        }
    }

    return _twMerge(classes);
}

export function getFormData<T extends Dict<any> = Dict<string>>(formElm: HTMLFormElement) {
    const dict = {} as T;
    const data = new FormData(formElm);
    data.forEach((val, key) => (dict[key] as any) = val);

    return dict;
}

export type FileDropEvent = DragEvent & {
    currentTarget: EventTarget & HTMLDivElement;
} & {
    dataTransfer: DataTransfer;
};
export class DragOverTracker {
    private dragCounter = 0;

    constructor(
        private elm: HTMLElement,
        private onChange: (dragover: boolean) => any,
        private onDrop: (e: FileDropEvent) => any,
    ) {
        elm.ondragenter = () => {
            this.dragCounter++;
            this.changeHandler(true);
        };
        elm.ondragleave = () => {
            this.dragCounter--;
            if (this.dragCounter === 0)
                this.changeHandler(false)
        };
        elm.ondragover = (e) => e.preventDefault();
        elm.ondrop = (e) => {
            e.preventDefault();
            this.dragCounter = 0;
            this.changeHandler(false);

            this.onDrop(e as FileDropEvent);
        };
    }

    destroy() {
        this.elm.ondragenter = null;
        this.elm.ondragleave = null;
        this.elm.ondragover = null;
        this.elm.ondrop = null;
    }

    private prevState = false;
    private changeHandler(newState: boolean) {
        if (this.prevState === newState) return;
        this.prevState = newState;

        this.onChange(newState);
    }
}

export async function downloadFile(url: string, filename: string | null = null) {
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = downloadUrl;
        
        // Use provided filename or try to extract from URL or response headers
        link.download = filename || extractFilenameFromUrl(url) || 'download';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
        
        console.log('File downloaded successfully');
    } catch (error) {
        console.error('Download failed:', error);
        // Fallback: try opening in new tab
        window.open(url, '_blank');
    }
};

function extractFilenameFromUrl(url: string) {
    try {
        const urlPath = new URL(url).pathname;
        const segments = urlPath.split('/');
        const filename = segments[segments.length - 1];
        return filename && filename.includes('.') ? filename : null;
    } catch {
        return null;
    }
};

export async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        return false;
    }
}