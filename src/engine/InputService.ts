class InputService {
  private currentKeyCode: string 
  private inputBeganCallback: ((inputObject: any) => void) | null;
  private inputEndedCallback: ((inputObject: any) => void) | null;
  private mousePosition: { x: number; y: number };
  private currentMouseButton: number | null; // 0: left, 1: middle, 2: right
  private onClickCallbacks: ((mouseData: any) => void)[];
  private onReleaseCallbacks: ((mouseData: any) => void)[];

  constructor() {
    this.currentKeyCode = "";
    this.inputBeganCallback = null;
    this.inputEndedCallback = null;
    this.mousePosition = { x: 0, y: 0 };
    this.currentMouseButton = null;
    this.onClickCallbacks = [];
    this.onReleaseCallbacks = [];

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this));
    document.addEventListener("mousemove", this.handleMouseMove.bind(this));
    document.addEventListener("mousedown", this.handleMouseDown.bind(this));
    document.addEventListener("mouseup", this.handleMouseUp.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent): void {
    this.currentKeyCode = event.code;
    const inputObject = this.createInputObject(event);
    if (this.inputBeganCallback) {
      this.inputBeganCallback(inputObject);
    }
  }

  private handleKeyUp(event: KeyboardEvent): void {
    this.currentKeyCode = "";
    const inputObject = this.createInputObject(event);

    if(this.inputEndedCallback) {
	    this.inputEndedCallback(inputObject)
    }
  }

  private handleMouseMove(event: MouseEvent): void {
    this.mousePosition = { x: event.clientX, y: event.clientY };
  }

  private handleMouseDown(event: MouseEvent): void {
    this.currentMouseButton = event.button; // Capture the mouse button
    const mouseData = this.createMouseData(event);
    this.onClickCallbacks.forEach((callback) => callback(mouseData));
  }

  private handleMouseUp(event: MouseEvent): void {
    this.currentMouseButton = null; // Clear the mouse button
    const mouseData = this.createMouseData(event);
    this.onReleaseCallbacks.forEach((callback) => callback(mouseData));
  }

  getCurrentKeyCode(): string {
    return this.currentKeyCode;
  }

  bindInputBegan(callback: (inputObject: any) => void): void {
    this.inputBeganCallback = callback;
  }

  bindInputEnded(callback: (inputObject: any) => void): void {
    this.inputEndedCallback = callback;
  }

  // Mouse Input
  GetMouse(): { x: number; y: number; button: number | null } {
    return {
      x: this.mousePosition.x,
      y: this.mousePosition.y,
      button: this.currentMouseButton,
    };
  }

  onClick(callback: (mouseData: any) => void): void {
    this.onClickCallbacks.push(callback);
  }

  onRelease(callback: (mouseData: any) => void): void {
    this.onReleaseCallbacks.push(callback);
  }

  private createInputObject(event: KeyboardEvent): any {
    return {
      KeyCode: event.code,
      IsShiftDown: event.shiftKey,
      IsControlDown: event.ctrlKey,
      IsAltDown: event.altKey,
    };
  }

  private createMouseData(event: MouseEvent): any {
    return {
      x: event.clientX,
      y: event.clientY,
      button: event.button, // 0: left, 1: middle, 2: right
      target: event.target,
    };
  }
}

export default InputService;
