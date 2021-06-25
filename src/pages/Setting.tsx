import React, { lazy } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";

import NumberMenuItems from "../components/NumberMenuItems";

import { AppState } from "../store";
import { initGame } from "../store/game/actions";
import { Game } from "../store/game/types";
import { updateSetting } from "../store/setting/actions";
import { Setting } from "../store/setting/types";

import { ThreeSixtyOutlined } from "@material-ui/icons";
import withRoot from "../withRoot";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      textAlign: "center",
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translateY(-50%) translateX(-50%)",
    },
    wrapper: {
      margin: theme.spacing.unit * 2,
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 150,
    },
  });

interface AppProps extends WithStyles<typeof styles> {
  initGame: typeof initGame;
  updateSetting: typeof updateSetting;
  setting: Setting;
  game: Game;
}

interface State {
  openName: boolean;
  openRole: boolean;
  names: string[];
  players: number;
  werewolves: number;
  seers: number;
  witch: number;
  hunter: number;
  interval: number;
  cupid: number;
  fairy: number;
  protector: number;
  whitewolves: number;
  demonwolves: number;
}

const voices = [
  "Hỡi những con sói gian ác hãy tỉnh dậy đi",
  "Cupid ơi tỉnh dậy đi đừng ngủ nữa",
  "Cupid muốn ghép đôi ai với ai",
  "Tiên tri ơi, dậy đi",
  "Tiên tri muốn soi ai",
  "Sói trùm ơi dậy đi, đừng ngủ nữa",
  "Sói trùm muốn nhận người này làm sói không",
  "Sói trắng ơi dậy đi",
  "Đêm nay sói trắng muốn cắn con sói nào không",
  "Phù thủy ơi dậy đi",
  "Đêm nay người này bị chết, phù thủy muốn cứu không",
  "",
];

class Index extends React.Component<AppProps, State> {
  constructor(props: Readonly<AppProps>) {
    super(props);

    const {
      players,
      seers,
      witch,
      hunter,
      cupid,
      fairy,
      protector,
      whitewolves,
      demonwolves,
    } = this.props.setting;
    this.state = {
      openName: false,
      openRole: false,
      names: this.props.game.players.map(val => val.name),
      players,
      werewolves: Math.max(
        1,
        Math.floor(Number(this.props.setting.players) / 3)
      ),
      seers,
      witch,
      hunter,
      cupid,
      fairy,
      interval: this.props.setting.interval,
      protector,
      whitewolves,
      demonwolves,
    };
  }
  public updateSetting = () => {
    const {
      players,
      werewolves,
      seers,
      witch,
      interval,
      hunter,
      cupid,
      fairy,
      whitewolves,
      demonwolves,
      protector,
    } = this.state;
    const newSetting: Setting = {
      players,
      villagers: this.calcRemains(1),
      werewolves,
      seers,
      witch,
      interval,
      hunter,
      cupid,
      fairy,
      whitewolves,
      demonwolves,
      protector,
    };
    this.props.updateSetting(newSetting);
  };
  public initGame = () => {
    this.props.initGame(this.state.names, [
      this.state.cupid,
      this.state.werewolves,
      this.state.demonwolves,
      this.state.whitewolves,
      this.state.protector,
      this.state.seers,
      this.state.hunter,
      this.state.witch,
      this.state.fairy,
      this.calcRemains(1),
    ]);
  };
  public handleChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    switch (evt.target.name) {
      case "players":
        return this.setState({
          ...this.state,
          openName: true,
          players: Number(evt.target.value),
          werewolves: Math.max(1, Math.floor(Number(evt.target.value) / 3)),
        });
      case "whitewolves":
        return this.setState({
          ...this.state,
          werewolves:
            Number(evt.target.value) > this.state.whitewolves
              ? this.state.werewolves -
                (Number(evt.target.value) - this.state.whitewolves)
              : this.state.werewolves +
                (this.state.whitewolves - Number(evt.target.value)),
          whitewolves: Number(evt.target.value),
        });
      case "demonwolves":
        return this.setState({
          ...this.state,
          werewolves:
            Number(evt.target.value) > this.state.demonwolves
              ? this.state.werewolves -
                (Number(evt.target.value) - this.state.demonwolves)
              : this.state.werewolves +
                (this.state.demonwolves - Number(evt.target.value)),
          demonwolves: Number(evt.target.value),
        });
      default:
        return this.setState({
          ...this.state,
          [evt.target.name]: Number(evt.target.value),
        });
    }
  };
  public handleNameChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const { names } = this.state;
    const set = Number(evt.target.name);
    names[set] = evt.target.value;
    return this.setState({
      ...this.state,
      names,
    });
  };
  public handleOpenName = () =>
    this.setState({ ...this.state, openName: true });
  public handleOpenRole = () =>
    this.setState({ ...this.state, openRole: true });
  public handleCancel = () =>
    this.setState({ ...this.state, openName: false, openRole: false });
  public handleOk = () => this.handleCancel();
  public handleStart = () => {
    this.initGame();
    this.updateSetting();
  };

  public NameDialog = () => {
    const nums = new Array<number>(this.state.players);
    for (let i = 0; i < nums.length; i++) {
      nums[i] = i + 1;
    }
    return (
      <Dialog open={this.state.openName} onClose={this.handleCancel}>
        <DialogTitle>Names</DialogTitle>
        <DialogContent>
          {nums.map((item, i) => {
            return (
              <div key={i} className={this.props.classes.wrapper}>
                <TextField
                  name={String(i)}
                  value={this.state.names[i]}
                  label={`Player ${item}`}
                  onChange={this.handleNameChange}
                />
              </div>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  public calcRemains = (current: number) => {
    const {
      players,
      werewolves,
      seers,
      witch,
      hunter,
      cupid,
      whitewolves,
      demonwolves,
      protector,
      fairy,
    } = this.state;
    return (
      players -
      werewolves -
      seers -
      witch -
      cupid -
      hunter -
      whitewolves -
      demonwolves -
      protector -
      fairy +
      current -
      1
    );
  };

  public RoleDialog = () => {
    const villagers = this.calcRemains(1);
    return (
      <Dialog open={this.state.openRole} onClose={this.handleCancel}>
        <DialogTitle>Roles</DialogTitle>
        <DialogContent className={this.props.classes.wrapper}>
          <form>
            <FormControl
              className={this.props.classes.formControl}
              disabled={true}
            >
              <InputLabel>Dân làng</InputLabel>
              <Select name="villagers" value={villagers}>
                <MenuItem value={villagers}>{villagers}</MenuItem>
              </Select>
            </FormControl>
            <FormControl className={this.props.classes.formControl}>
              <InputLabel>Thần tình yêu</InputLabel>
              <Select
                name="cupid"
                value={this.state.cupid}
                onChange={this.handleChange}
              >
                {NumberMenuItems(
                  0,
                  this.calcRemains(
                    Number.isNaN(this.state.cupid) ? 0 : this.state.cupid
                  )
                )}
              </Select>
            </FormControl>
          </form>
          <form>
            <FormControl className={this.props.classes.formControl}>
              <InputLabel>Ma Sói</InputLabel>
              <Select
                name="werewolves"
                value={this.state.werewolves}
                onChange={this.handleChange}
              >
                {NumberMenuItems(
                  0,
                  this.calcRemains(
                    Number.isNaN(this.state.werewolves)
                      ? 0
                      : this.state.werewolves
                  )
                )}
              </Select>
            </FormControl>
            <FormControl className={this.props.classes.formControl}>
              <InputLabel>Thiên thần</InputLabel>
              <Select
                name="fairy"
                value={this.state.fairy}
                onChange={this.handleChange}
              >
                {NumberMenuItems(
                  0,
                  this.calcRemains(
                    Number.isNaN(this.state.fairy) ? 0 : this.state.fairy
                  )
                )}
              </Select>
            </FormControl>
          </form>
          <form>
            <FormControl className={this.props.classes.formControl}>
              <InputLabel>Tiên tri</InputLabel>
              <Select
                name="seers"
                value={this.state.seers}
                onChange={this.handleChange}
              >
                {NumberMenuItems(0, this.calcRemains(this.state.seers))}
              </Select>
            </FormControl>
            <FormControl className={this.props.classes.formControl}>
              <InputLabel>Bảo vệ</InputLabel>
              <Select
                name="protector"
                value={this.state.protector}
                onChange={this.handleChange}
              >
                {NumberMenuItems(0, this.calcRemains(this.state.protector))}
              </Select>
            </FormControl>
          </form>
          <form>
            <FormControl className={this.props.classes.formControl}>
              <InputLabel>Phù thuỷ</InputLabel>
              <Select
                name="witch"
                value={this.state.witch}
                onChange={this.handleChange}
              >
                {NumberMenuItems(0, this.calcRemains(this.state.witch))}
              </Select>
            </FormControl>
            <FormControl className={this.props.classes.formControl}>
              <InputLabel>Thợ săn</InputLabel>
              <Select
                name="hunters"
                value={this.state.hunter}
                onChange={this.handleChange}
              >
                {NumberMenuItems(
                  0,
                  this.calcRemains(
                    Number.isNaN(this.state.hunter) ? 0 : this.state.hunter
                  )
                )}
              </Select>
            </FormControl>
          </form>
          <form>
            <FormControl className={this.props.classes.formControl}>
              <InputLabel>Sói trùm</InputLabel>
              <Select
                name="demonwolves"
                value={this.state.demonwolves}
                onChange={this.handleChange}
              >
                {NumberMenuItems(0, this.calcRemains(this.state.demonwolves))}
              </Select>
            </FormControl>
            <FormControl className={this.props.classes.formControl}>
              <InputLabel>Sói trắng</InputLabel>
              <Select
                name="whitewolves"
                value={this.state.whitewolves}
                onChange={this.handleChange}
              >
                {NumberMenuItems(0, this.calcRemains(this.state.whitewolves))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="secondary">
            Cancel
          </Button>
          <Button onClick={this.handleOk} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  public render() {
    return (
      <div className={this.props.classes.root}>
        <Typography variant="h4" gutterBottom={true}>
          Game Setting
        </Typography>
        <form className={this.props.classes.wrapper} autoComplete="off">
          <FormControl className={this.props.classes.formControl}>
            <InputLabel>Numbers of Players</InputLabel>
            <Select
              name="players"
              value={this.state.players}
              onChange={this.handleChange}
              onClose={this.handleOpenName}
            >
              {NumberMenuItems(4, 12)}
            </Select>
          </FormControl>
        </form>
        <div className={this.props.classes.wrapper}>
          <Button variant="outlined" onClick={this.handleOpenName}>
            Player Names
          </Button>
        </div>
        <this.NameDialog />
        <div className={this.props.classes.wrapper}>
          <Button variant="outlined" onClick={this.handleOpenRole}>
            Roles
          </Button>
        </div>
        <this.RoleDialog />
        <FormControl className={this.props.classes.formControl}>
          <InputLabel>Interval seconds</InputLabel>
          <Select
            name="interval"
            value={this.state.interval}
            onChange={this.handleChange}
          >
            {NumberMenuItems(30, 600, 30)}
          </Select>
        </FormControl>
        <div className={this.props.classes.wrapper}>
          <Fab
            onClick={this.handleStart}
            component={Link}
            {...({ to: "/night" } as any)}
            variant="extended"
            color="primary"
            size="large"
          >
            START
          </Fab>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  setting: state.setting,
  game: state.game,
});

export default connect(mapStateToProps, { updateSetting, initGame })(
  withRoot(withStyles(styles)(Index))
);
