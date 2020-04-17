export interface EventMap extends Object {
    TAP: Array<Function>;
    SWIPE_LEFT: Array<Function>;
    SWIPE_UP: Array<Function>;
    SWIPE_DOWN: Array<Function>;
    SWIPE_RIGHT: Array<Function>;
    DRAG: Array<Function>;
    MOUSEENTER: Array<Function>;
    MOUSELEAVE: Array<Function>;  
    [key: string]: any;
}
export interface PointerData {
    startTime: number;
    touchDuration: number;
    xDown: number;
    yDown: number;
    element?: HTMLElement;
    isMouseDown: boolean;
    dragging: boolean;
    dragx: number;
    dragy: number;
    triggerPercent: number;
}