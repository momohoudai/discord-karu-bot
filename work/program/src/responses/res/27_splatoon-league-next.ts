﻿
import { SplatoonHelper, eBattleTypes } from 'responses/common/SplatoonHelper';
import { cResponseBase } from 'libs/Responder/cResponseBase';
import { cCallbackParams } from '../cCallbackParams';
import { getRuleByCondition, cRuleInfo } from 'responses/common/SplatoonData'

class cResponse extends cResponseBase {

	private readonly battleType: eBattleTypes = eBattleTypes.LEAGUE;
	private conditions: string[][] = [
		SplatoonHelper.CONDITION_BATTLE_TYPE[this.battleType],
		["next"],
	];

	public async exec(params: cCallbackParams): Promise<boolean> {


		if (!SplatoonHelper.ConditionsProc(this.conditions, params.msg.content)) {
			return false;
		}

		// Check for rule types
		let ruleInfo: cRuleInfo | null = getRuleByCondition(params.msg.content);
		if (ruleInfo == null) {
			let title: string = "(ﾉ≧∇≦)ﾉ ﾐ The next League Battle is...!";
			await SplatoonHelper.GetEmbedScheduleNext(params, title, this.battleType);
		}

		else {
			let title: string = "(ﾉ≧∇≦)ﾉ ﾐ The next League " + ruleInfo.Name + " is...!";
			await SplatoonHelper.GetEmbedScheduleNextRule(params, title, this.battleType, ruleInfo.Type);
		}

		return true;
	}
	
}

export = function () {
	return new cResponse();
}