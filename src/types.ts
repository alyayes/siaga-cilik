/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: string;
  theme: string;
  question: string;
  options: string[];
  correctAnswer: number; // index
  explanation: string;
}

export type DisasterTheme = 'Bencana Air' | 'Bencana Tanah' | 'Bencana Api' | 'Bencana Udara';

export type BoardTileType = 
  | 'DISASTER' 
  | 'CHALLENGE' 
  | 'SAFETY' 
  | 'BONUS' 
  | 'CORNER' 
  | 'CHANCE'
  | 'JAIL'
  | 'START'
  | 'MUNDUR';

export interface BoardTile {
  id: string;
  type: BoardTileType;
  label: string;
  subLabel?: string;
  interactionType?: 'ANSWER' | 'SORT' | 'STORY'; 
  theme?: DisasterTheme;
  points?: number; // for fixed point tiles if any
  bonusDescription?: string;
  icon?: string;
  gridX: number;
  gridY: number;
  isSpecial?: boolean;
}

export interface Group {
  id: number;
  name: string;
  stars: number;
}

export interface GameSession {
  className: string;
  questionCount: number;
  currentTurn: number; // index of group
  groups: Group[];
  totalStars: number;
  completedQuestions: string[];
  history: string[]; // explanations for recap
}
