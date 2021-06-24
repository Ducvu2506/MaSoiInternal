import { Setting, SettingActionTypes, UPDATE_SETTINGS } from "./types";

const initialState: Setting = {
  players: 10,
  villagers: 2,
  werewolves: 3,
  seers: 1,
  witch: 1,
  hunter: 1,
  interval: 120,
  cupid: 1,
  fairy: 0,
  protector: 1,
  whitewolves: 0,
  demonwolves: 0,
};

export default function settingReducer(
  state = initialState,
  action: SettingActionTypes
): Setting {
  switch (action.type) {
    case UPDATE_SETTINGS:
      return {
        ...state,
        ...action.setting,
      };
    default:
      return state;
  }
}
