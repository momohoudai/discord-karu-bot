﻿import { common } from 'common/common';
import { RichEmbedWrapper as Rewrap } from 'responses/common/EmbedHelper';
import { cResponseBase } from 'libs/Responder/cResponseBase';
import { cCallbackParams } from '../cCallbackParams';
import { rand_msg } from 'messages/MsgArrayThanks'
import { Client, Message, RichEmbed } from 'discord.js';
import { iSchedule, iCompetitiveScheduleInfo } from 'libs/SplatoonInkApi/cSplatoonInkDefines';
import { cSplatoonInkApi } from 'libs/SplatoonInkApi/cSplatoonInkApi';
import { Globals } from 'globals/Globals'
import { sprintf } from 'sprintf-js';

class cResponse extends cResponseBase {
	private readonly color: [number, number, number] = [245, 73, 16];
	private readonly splatoonWikiUrl: string = "https://splatoonwiki.org/wiki/";
	private readonly imgOutputName: string = "out_gachi.jpg";
	private readonly imgAuthor: string = "karu.png"
	private readonly imgThumbnail: string = "gachi.png"
	private readonly authorName: string = "Karu";
	private readonly title: string = "(ﾉ≧∇≦)ﾉ ﾐ GACHI!!!"

	public async exec(params: cCallbackParams): Promise<boolean> {
		let f = common.has_words;
		let c = params.msg.content;
		if (!f(c, ["gachi", "ranked"])) {
			return false;
		}

		let currentMessage: Message = <Message>(await params.msg.channel.send("（｀・ω・´）Gimme a sec..."));

		// Call API to get the schedule and locale info
		const localeJp: any = await cSplatoonInkApi.getLocaleJp();
		const r: iSchedule = await cSplatoonInkApi.getSchedule();
		const result: iCompetitiveScheduleInfo = r.gachi[0];
		const stageAUrl: string = this.splatoonWikiUrl + result.stage_a.name.replace(/\s/g, "_");
		const stageBUrl: string = this.splatoonWikiUrl + result.stage_b.name.replace(/\s/g, "_");
		const ruleUrl: string = this.splatoonWikiUrl + result.rule.name.replace(/\s/g, "_");
		const stageAPath: string = Globals.ImgStagesPath + result.stage_a.name + ".jpg";
		const stageBPath: string = Globals.ImgStagesPath + result.stage_b.name + ".jpg";

		await currentMessage.edit("(｀・ω・´)9  Just a bit more...");

		let embed: Rewrap = new Rewrap();
		embed.RichEmbed.setTitle(this.title)
			.setColor(this.color)
			.addField("Mode:", sprintf("[%s](%s)\n%s\n", result.rule.name, ruleUrl, localeJp["rules"][result.rule.key].name))
			.addField("Maps:", sprintf("[%s](%s)\n%s\n[%s](%s)\n%s",
				result.stage_a.name,
				stageAUrl,
				localeJp["stages"][result.stage_a.id].name,
				result.stage_b.name,
				stageBUrl,
				localeJp["stages"][result.stage_b.id].name,
			));


		await embed.SetAuthorWithImg(Globals.ImgPath + this.imgAuthor, this.imgAuthor, this.authorName);
		await embed.SetThumbnailImg(Globals.ImgPath + this.imgThumbnail, this.imgThumbnail);
		await embed.SetImgMultiple([stageAPath, stageBPath], Globals.ImgOutPath + this.imgOutputName, this.imgOutputName);
		await currentMessage.edit("(;;｀・ω・´)9  Almost...there...");
		await params.msg.channel.send(embed.Finalize());
		await currentMessage.delete();

		return true;
	}
	
}

export = function () {
	return new cResponse();
}