import { CardEvent, CardState, transition} from '../machine/cardMachine';

export class Card {
    private id: number;
    private display: string;

    private state: CardState = CardState.HIDDEN;

    constructor(display: string, id: number) {
        this.display = display;
        this.id = id;
    }

    hideCard() {
        if (this.state !== CardState.REVEALED) return;
        this.state = transition(this.state, CardEvent.FLIP);
    }

    showCard() {
        if (this.state !== CardState.HIDDEN) return;
        this.state = transition(this.state, CardEvent.FLIP);
    }

    revealCard() {
        this.state = transition(this.state, CardEvent.MATCH);
    } 

    getDisplay(): string {
        return this.display;
    }

    getId(): number {
        return this.id;
    }

    isHidden(): boolean {
        return this.state === CardState.HIDDEN;
    }

    isRevealed(): boolean {
        return this.state === CardState.REVEALED;
    }

    isMatched(): boolean {
        return this.state === CardState.MATCHED;
    }

}