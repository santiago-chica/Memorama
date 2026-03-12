import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { IonGrid, IonRow, IonCol, IonButton } from '@ionic/angular/standalone';
import { Card } from 'src/classes/cardClass';
import { emojis } from 'src/repositories/emojis';
import { GameEvent, GameState, transition} from '../../machine/gameMachine';
import { CreatePromptComponent } from '../create-prompt/create-prompt.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, CommonModule, CreatePromptComponent, IonButton],
})
export class HomePage {
  horizontal_card_count: number = 4;
  vertical_card_count: number = 4;

  cards: Card[][] = [];
  currentCard: Card | null = null;

  emoji_id_map: Map<string, number> = new Map();
  id_emoji_map: Map<number, string> = new Map();

  game_state: GameState = GameState.IDLE;
  attempts: number = 0;


  constructor() {
    this.createCards();
  }

  startGame(dimensions: { horizontal: number; vertical: number }) {
    console.log('Dimensiones recibidas:', dimensions);
    this.horizontal_card_count = dimensions.horizontal;
    this.vertical_card_count = dimensions.vertical;
    this.game_state = transition(this.game_state, GameEvent.START);
    this.createCards();
  }

  createCards() {
    this.emoji_id_map.clear();
    this.id_emoji_map.clear();
    this.cards = [];
    this.attempts = 0;

    const shuffled_emojis = [...emojis].sort(() => Math.random() - 0.5);
    const different_emoji_count: number = (this.horizontal_card_count * this.vertical_card_count) / 2;

    const selected_emojis: string[] = shuffled_emojis.slice(0, different_emoji_count);
    const paired_emojis: string[] = [...selected_emojis, ...selected_emojis].sort(() => Math.random() - 0.5);

    selected_emojis.forEach((emoji, index) => {
      this.emoji_id_map.set(emoji, index);
      this.id_emoji_map.set(index, emoji);
    });

    for (let i = 0; i < this.vertical_card_count; i++) {
      const row: Card[] = [];
      for (let j = 0; j < this.horizontal_card_count; j++) {
        const cardIndex = i * this.horizontal_card_count + j;
        const cardId = this.emoji_id_map.get(paired_emojis[cardIndex]) || 0;
        row.push(new Card(paired_emojis[cardIndex], cardId));
      }
      this.cards.push(row);
    }
  }

  isGameOn() {
    return this.game_state === GameState.IN_PROGRESS || this.game_state === GameState.HALTED;
  }

  hasWon() {
    return this.game_state === GameState.FINISHED;
  }

  finishAttempt(hasWon: boolean = false) {
    if (hasWon) {
      this.game_state = transition(this.game_state, GameEvent.WIN);
      return;
    }
    this.game_state = transition(this.game_state, GameEvent.END);
  }

  clickCard(card: Card) {

    if (this.game_state !== GameState.IN_PROGRESS) return;
    // Carta revelada
    if (card.isMatched()) return;
    // Misma carta
    if (this.currentCard === card) {
      card.hideCard();
      this.attempts++;
      this.currentCard = null;
      return;
    };

    // Primera carta
    if (this.currentCard === null) {
      card.showCard();
      this.currentCard = card;
      console.log('Primera carta:', card.getDisplay());
      return;
    }
    // Segunda carta
    
    const current_card_display = this.currentCard.getDisplay();
    const clicked_card_display = card.getDisplay();

    this.attempts++;

    if (current_card_display !== clicked_card_display) {
      this.game_state = transition(this.game_state, GameEvent.HALT);
      card.showCard();

      if (this.game_state === GameState.HALTED) {
        setTimeout(() => {
          this.currentCard?.hideCard();
          card.hideCard();
          this.currentCard = null;
          this.game_state = transition(this.game_state, GameEvent.RESUME);
        }, 1000);
      }
    } else {
      // Match bueno
      this.currentCard.revealCard();
      card.revealCard();
      this.currentCard = null;
      // Revisar cartas restantes
      const hasUnmatchedCards = this.cards.some(row => row.some(c => !c.isMatched()));
      if (!hasUnmatchedCards || this.cards.length === 0) {
        this.finishAttempt(true);
      }
    }
   
    
  }

  




}
