import { FighterState } from "../../constants/fighter.js";
import { STAGE_FLOOR } from "../../constants/stage.js";
import { isKeyDown, isKeyUp } from "../../controlHandler.js";
import * as control from "../../controlHandler.js";

export class Character {
    constructor(name, x, y, direction, playerId) {
        this.name = name;
        this.playerId = playerId;

        this.position = { x, y };
        this.direction = direction;
        this.velocity = { x: 0, y: 0 };
        this.initialVelocity = {};
        this.gravity = 0;

        this.frames = new Map();
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animations = {};

        this.image = new Image();

        this.states = {
            [FighterState.IDLE]: {
                init: this.handleWalkIdleInit.bind(this),
                update: this.handleIldeState.bind(this),
                validForm: [
                    undefined,
                    FighterState.IDLE,
                    FighterState.WALK_FORWARD,
                    FighterState.WALK_BACKWARD,
                    FighterState.JUMP_UP,
                    FighterState.JUMP_FORWARD,
                    FighterState.JUMP_BACKWARD,
                    FighterState.CROUCH_UP,
                ],
            },
            [FighterState.WALK_FORWARD]: {
                init: this.handleMoveInit.bind(this),
                update: this.handleWalkForwardState.bind(this),
                validForm: [FighterState.IDLE, FighterState.WALK_BACKWARD],
            },
            [FighterState.WALK_BACKWARD]: {
                init: this.handleMoveInit.bind(this),
                update: this.handleWalkBackwardState.bind(this),
                validForm: [FighterState.IDLE, FighterState.WALK_FORWARD],
            },
            [FighterState.JUMP_UP]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validForm: [FighterState.IDLE],
            },
            [FighterState.JUMP_FORWARD]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validForm: [FighterState.IDLE, FighterState.WALK_FORWARD],
            },
            [FighterState.JUMP_BACKWARD]: {
                init: this.handleJumpInit.bind(this),
                update: this.handleJumpState.bind(this),
                validForm: [FighterState.IDLE, FighterState.WALK_BACKWARD],
            },
            [FighterState.CROUCH]: {
                init: this.handleCrouchInit.bind(this),
                update: this.handleCrouchState.bind(this),
                validForm: [FighterState.CROUCH_DOWN],
            },
            [FighterState.CROUCH_DOWN]: {
                init: () => {},
                update: this.handleCrouchDownState.bind(this),
                validForm: [
                    FighterState.IDLE,
                    FighterState.WALK_FORWARD,
                    FighterState.WALK_BACKWARD,
                ],
            },
            [FighterState.CROUCH_UP]: {
                init: () => {},
                update: this.handleCrouchUpState.bind(this),
                validForm: [FighterState.CROUCH],
            },
        };

        this.changeState(FighterState.IDLE);
    }

    changeState(newState) {
        if (
            newState === this.currentState ||
            !this.states[newState].validForm.includes(this.currentState)
        )
            return;

        this.currentState = newState;
        this.animationFrame = 0;

        this.states[this.currentState].init();
    }

    /* IDLE */
    handleWalkIdleInit() {
        this.velocity.x = 0;
        this.velocity.y = 0;
    }

    handleIldeState() {
        if (control.isUp(this.playerId)) this.changeState(FighterState.JUMP_UP);
        if (control.isDown(this.playerId))
            this.changeState(FighterState.CROUCH_DOWN);
        if (control.isBackward(this.playerId, this.direction))
            this.changeState(FighterState.WALK_BACKWARD);
        if (control.isForward(this.playerId, this.direction))
            this.changeState(FighterState.WALK_FORWARD);
    }

    /* WALK MOVEMENT */
    handleMoveInit() {
        this.velocity.x = this.initialVelocity.x[this.currentState] ?? 0;
    }

    handleWalkForwardState() {
        if (!control.isForward(this.playerId, this.direction))
            this.changeState(FighterState.IDLE);
        if (control.isUp(this.playerId))
            this.changeState(FighterState.JUMP_FORWARD);
        if (control.isDown(this.playerId))
            this.changeState(FighterState.CROUCH_DOWN);
    }

    handleWalkBackwardState() {
        if (!control.isBackward(this.playerId, this.direction))
            this.changeState(FighterState.IDLE);
        if (control.isUp(this.playerId))
            this.changeState(FighterState.JUMP_BACKWARD);
        if (control.isDown(this.playerId))
            this.changeState(FighterState.CROUCH_DOWN);
    }

    /* JUMPS*/
    handleJumpInit() {
        this.velocity.y = this.initialVelocity.jump;
        this.handleMoveInit();
    }

    handleJumpState(time) {
        this.velocity.y += this.gravity * time.secondsPassed;

        if (this.position.y > STAGE_FLOOR) {
            this.position.y = STAGE_FLOOR;
            this.changeState(FighterState.IDLE);
        }
    }

    /* CROUCH */

    handleCrouchInit() {
        this.handleWalkIdleInit();
    }

    handleCrouchState() {
        if (!control.isDown(this.playerId))
            this.changeState(FighterState.CROUCH_UP);
    }

    handleCrouchDownState() {
        if (this.animations[this.currentState][this.animationFrame][1] === -2) {
            this.changeState(FighterState.CROUCH);
        }
    }

    handleCrouchUpState() {
        if (this.animations[this.currentState][this.animationFrame][1] === -2) {
            this.changeState(FighterState.IDLE);
        }
    }

    updateStageContraints(context) {
        const WIDTH = 32;

        if (this.position.x > context.canvas.width - WIDTH) {
            this.position.x = context.canvas.width - WIDTH;
        } else if (this.position.x < WIDTH) {
            this.position.x = WIDTH;
        }
    }

    updateAnimation(time) {
        const animation = this.animations[this.currentState];
        const [, frameDelay] = animation[this.animationFrame];

        if (time.previous > this.animationTimer + frameDelay) {
            this.animationTimer = time.previous;

            if (frameDelay > 0) this.animationFrame++;

            if (this.animationFrame >= animation.length)
                this.animationFrame = 0;
        }
    }

    update(time, context) {
        if (document.visibilityState === "visible") {
            // check if visibility of current windows and update positions
            this.position.x +=
                this.velocity.x * this.direction * time.secondsPassed;
            this.position.y += this.velocity.y * time.secondsPassed;
        }

        this.states[this.currentState].update(time, context);
        this.updateAnimation(time);
        this.updateStageContraints(context);
    }

    drawDebug(context) {
        context.lineWidth = 1;

        context.beginPath();
        context.strokeStyle = "white";
        context.moveTo(
            Math.floor(this.position.x) - 4.5,
            Math.floor(this.position.y)
        );
        context.lineTo(
            Math.floor(this.position.x) + 4.5,
            Math.floor(this.position.y)
        );
        context.moveTo(
            Math.floor(this.position.x),
            Math.floor(this.position.y - 4.5)
        );
        context.lineTo(
            Math.floor(this.position.x),
            Math.floor(this.position.y + 4.5)
        );
        context.stroke();
    }

    draw(context) {
        const [[x, y, width, height], [originX, originY]] = this.frames.get(
            this.animations[this.currentState][this.animationFrame][0]
        );

        context.scale(this.direction, 1);
        context.drawImage(
            this.image,
            x,
            y,
            width,
            height,
            Math.floor(this.position.x * this.direction) - originX,
            Math.floor(this.position.y) - originY,
            width,
            height
        );
        context.setTransform(1, 0, 0, 1, 0, 0);

        this.drawDebug(context);
    }
}
