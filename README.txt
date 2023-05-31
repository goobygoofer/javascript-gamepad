# javascript-gamepad
simple handling for gamepad in browser with visual example


All that is needed to handle the gamepad is handleGamepad() from index.js.
gp_buttons, gp_axes, pad_connected, deadzoneL, deadzoneR are needed for this fxn to run.

gp_buttons and gp_axes contain the states of the buttons (true/false) and position of the joysticks, respectively.
To use this in your own project, handleGamepad() must be running on an interval and you need another function
to read the states of the buttons/joysticks to control stuff in your project

For the visual example, main() is run on an interval (60fps) 
    -update joystick and button states of the gamepad
    -draws background and gamepad
    -draws any pressed buttons and position of the joysticks
