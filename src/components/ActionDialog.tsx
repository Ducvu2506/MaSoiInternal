import React from "react";
import { connect } from "react-redux";

import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from "@material-ui/core";

import { AppState } from "../store";
import { actionPlayer, finishAction } from "../store/game/actions";
import { Game, Player, Roles } from "../store/game/types";

const styles = (theme: Theme) =>
  createStyles({
    wrapper: {
      margin: theme.spacing.unit * 2,
    },
    openButton: {
      textTransform: "none",
    },
    select: {
      minWidth: 150,
    },
  });
const roleList = [
  "cupid",
  "werewolf",
  "demonwolves",
  "whitewolves",
  "protector",
  "seer",
  "witch",
  "hunter",
  "fairy",
  "villager",
];
interface Props extends WithStyles<typeof styles> {
  actionPlayer: typeof actionPlayer;
  finishAction: typeof finishAction;
  game: Game;
  player: Player;
  role: Roles;
}

interface State {
  open: boolean;
  resultOpen: boolean;
  selectedId: number | null;
}

class ActionDialog extends React.Component<Props, State> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      open: false,
      resultOpen: false,
      selectedId: null,
    };
  }

  public actionPlayer = (actionId: number) => {
    this.props.actionPlayer(
      this.props.game.players,
      this.props.player.id,
      actionId
    );
  };

  public finishAction = () =>
    this.props.finishAction(this.props.game.players, this.props.player.id);

  public handleClickOpen = () => this.setState({ ...this.state, open: true });

  public handleClose = () => {
    this.finishAction();
    this.setState({
      ...this.state,
      open: false,
      resultOpen: this.props.player.role === Roles.seer,
    });
  };

  public handleResultClose = () =>
    this.setState({
      ...this.state,
      resultOpen: false,
    });

  public handleChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const actionId = Number(evt.target.value);
    this.actionPlayer(actionId);
    this.setState({
      ...this.state,
      selectedId: actionId,
    });
  };

  public ActionResultDialog = () => {
    const { game, player } = this.props;
    return (
      <Dialog
        open={this.state.resultOpen}
        keepMounted={true}
        onClose={this.handleResultClose}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">Result</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {game.players
              .filter(p => p.id === player.actionId)
              .map(p => `${p.name} is ${Roles[p.role]}`)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleResultClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  public PlayerMenuItems = () => {
    const players = this.props.game.players;

    return (
      <div>
        {this.props.player.role === Roles.werewolf && (
          <Typography variant="body2">
            Others:{" "}
            {players
              .filter(
                player =>
                  player.role === Roles.werewolf && player !== this.props.player
              )
              .map(player => player.name)
              .join(", ")}
          </Typography>
        )}
        <Select
          value={this.props.player.actionId || 0}
          onChange={this.handleChange}
          className={this.props.classes.select}
        >
          {this.props.player.role !== Roles.protector &&
            players
              .filter(p => p.alive)
              .map(p => {
                return (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                );
              })}
          {this.props.player.role === Roles.protector &&
            players
              .filter(p => p.alive && p.name !== this.props.player.hasPower[0])
              .map(p => {
                return (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name}
                  </MenuItem>
                );
              })}
        </Select>
      </div>
    );
  };

  public render() {
    const { classes, player } = this.props;
    const { open } = this.state;
    let line = " ";
    if (player.role === Roles.cupid) {
      line = "Cupid ch???n c???p ????i ??i n??o: ";
    } else if (player.role === Roles.werewolf) {
      line = "????m nay s??i mu???n c???n ai: ";
    } else if (player.role === Roles.demonwolves) {
      line = "S??i tr??m mu???n nh???n ng?????i n??y l??m s??i kh??ng";
    } else if (player.role === Roles.whitewolves) {
      line = "S??i tr???ng mu???n c???n con s??i n??o kh??ng";
    } else if (player.role === Roles.hunter) {
      line = "????m nay th??? s??n mu???n k??o theo ai :";
    } else if (player.role === Roles.seer) {
      line = "????m nay ti??n tri mu???n soi ai :";
    } else if (player.role === Roles.witch) {
      line = "????m nay ng?????i n??y b??? c???n ph?? th???y mu???n c???u kh??ng: ";
    } else if (player.role === Roles.protector) {
      line = "????m nay b???o v??? mu???n b???o v??? ai :";
    }
    return (
      <div className={classes.wrapper}>
        <this.ActionResultDialog />
        <Button
          variant="outlined"
          color="primary"
          disabled={this.props.player.actioned}
          onClick={this.handleClickOpen}
          className={classes.openButton}
        >
          Action: {roleList[player.role]}
        </Button>
        <Dialog
          open={open}
          keepMounted={true}
          onClose={this.handleClose}
          aria-labelledby="dialog-title"
          aria-describedby="dialog-description"
        >
          <DialogTitle id="dialog-title">
            {roleList[player.role].toUpperCase()}
          </DialogTitle>
          <DialogContent>
            <Typography variant="body1">{line}</Typography>
            {player.role !== Roles.villager && player.role !== Roles.cupid && (
              <this.PlayerMenuItems />
            )}
            {player.role === Roles.cupid ? (
              <div>
                <Typography variant="body1">Ch???n ng?????i th??? nh???t</Typography>
                <this.PlayerMenuItems />
                <Typography variant="body1">Ch???n ng?????i th??? hai</Typography>
                <this.PlayerMenuItems />
              </div>
            ) : (
              ""
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  game: state.game,
});

export default connect(mapStateToProps, { actionPlayer, finishAction })(
  withStyles(styles)(ActionDialog)
);
