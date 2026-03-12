
export enum CardState {
  HIDDEN = 'HIDDEN',
  REVEALED = 'REVEALED',
  MATCHED = 'MATCHED',
}

export enum CardEvent {
    FLIP = 'FLIP',
    MATCH = 'MATCH'
}

export const machine: any = {
    HIDDEN: {
        FLIP: CardState.REVEALED,
        MATCH: CardState.MATCHED
    },
    REVEALED: {
        FLIP: CardState.HIDDEN,
        MATCH: CardState.MATCHED
    }
}

export const transition = (state: CardState, event: CardEvent): CardState => {
    if (!machine[state]) return state;
    
    const newState: CardState | null = machine[state][event];
    if (newState) return newState;
    
    return state;
}