﻿
const messages: string[] = [
	"You're welcome!",
	"Ah, it's not a bother ^^",
	"Only here to help!　（｀・ω・´）",
]

export function rand_msg(): string {
	let rand: number = Math.floor(Math.random() * messages.length);
	return messages[rand];
}