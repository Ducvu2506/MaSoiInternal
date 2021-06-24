export interface Setting {
  players: number;
  villagers: number;
  werewolves: number;
  seers: number;
  witch: number;
  hunter: number;
  interval: number;
  cupid: number;
  fairy : number;
  protector: number;
  whitewolves: number;
  demonwolves: number;
}

export const UPDATE_SETTINGS = "UPDATE_SETTINGS";

interface UpdateSettingsAction {
  type: typeof UPDATE_SETTINGS;
  setting: Setting;
}

export type SettingActionTypes = UpdateSettingsAction;
