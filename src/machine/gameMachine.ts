

export enum GameState {
    IDLE = 'IDLE',
    IN_PROGRESS = 'IN_PROGRESS',
    HALTED =  'HALTED',
    FINISHED = 'FINISHED',
    ERROR = 'ERROR'
}

export enum GameEvent {
    START = 'START',
    WIN = 'WIN',
    END = 'END',
    ERROR = 'ERROR',
    HALT = 'HALT',
    RESUME = 'RESUME'
}

export const machine: any = {
    IDLE: {
        START: GameState.IN_PROGRESS,
        ERROR: GameState.ERROR
    },
    IN_PROGRESS: {
        WIN: GameState.FINISHED,
        END: GameState.IDLE,
        ERROR: GameState.ERROR,
        HALT: GameState.HALTED
    },
    HALTED: {
        RESUME: GameState.IN_PROGRESS,
        END: GameState.IDLE,
        WIN: GameState.FINISHED,
        ERROR: GameState.ERROR
    },
    FINISHED: {
        START: GameState.IN_PROGRESS,
        ERROR: GameState.ERROR
    }
}

export const transition = (state: GameState, event: GameEvent): GameState => {
    if (!machine[state]) return state;
    return machine[state][event] || state;
};