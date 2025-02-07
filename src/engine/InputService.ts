class InputService {
  private currentKeyCode: string | null; // Store the current key code
  private inputBeganCallback: ((inputObject: any) => void) | null;

  constructor() {
    this.currentKeyCode = null; // Initialize to null
    this.inputBeganCallback = null;

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    document.addEventListener("keyup", this.handleKeyUp.bind(this)); // Add keyup listener
  }

  private handleKeyDown(event: KeyboardEvent): void {
    this.currentKeyCode = event.code; // Capture the key code
    const inputObject = this.createInputObject(event);
    if (this.inputBeganCallback) {
      this.inputBeganCallback(inputObject);
    }
  }

  private handleKeyUp(): void {
    this.currentKeyCode = null; // Clear the key code when released
  }

  getCurrentKeyCode(): string | null {
    return this.currentKeyCode;
  }

  bindInputBegan(callback: (inputObject: any) => void): void {
    this.inputBeganCallback = callback;
  }

  private createInputObject(event: KeyboardEvent): any {
    return {
      KeyCode: event.code,
      IsShiftDown: event.shiftKey,
      IsControlDown: event.ctrlKey,
      IsAltDown: event.altKey,
    };
  }
}

export default InputService;

