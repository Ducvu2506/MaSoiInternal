import React, { lazy } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import {
  Button,
  createStyles,
  Fab,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from "@material-ui/core";

import { NavigateNext } from "@material-ui/icons";

const ActionDialog = lazy(() => import("../components/ActionDialog"));

import { AppState } from "../store";
import { tickTime } from "../store/game/actions";
import { Game, Roles, Time } from "../store/game/types";

import withRoot from "../withRoot";

const styles = (theme: Theme) =>
  createStyles({
    root: {
      paddingTop: theme.spacing.unit * 10,
      textAlign: "center",
    },
    wrapper: {
      margin: theme.spacing.unit * 2,
    },
    stepper: {
      backgroundColor: "transparent",
    },
    content: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
    },
    stepLabel: {
      textAlign: "left",
    },
  });
interface AppProps extends WithStyles<typeof styles> {
  tickTime: typeof tickTime;
  game: Game;
}

interface State {
  activeStep: number;
  voice: string;
}

class Night extends React.Component<AppProps, State> {
  public roleList = [
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
  constructor(props: Readonly<AppProps>) {
    super(props);

    this.state = {
      activeStep: 0,
      voice: "",
    };
  }

  public handleNext = () =>
    this.setState({ ...this.state, activeStep: this.state.activeStep + 1 });

  public setActiveStep = (step: number) => {
    this.setState({ ...this.state, activeStep: step });
    this.playVoice("C:\\Work\\MaSoiInternal\\public\\soioidaydi.mp3");
  };

  public tickTime = () => this.props.tickTime(this.props.game, Time.noon);

  public handleSongLoading = () => {
    console.log("handleSongLoading");
  };
  public handleSongPlaying = () => {
    console.log("handleSongPlaying");
  };
  public handleSongFinishedPlaying = () => {
    console.log("handleSongFinishedPlaying");
  };

  public playVoice = (endpoint: string) => {
    this.setState({ voice: endpoint });
  };

  public render() {
    const { classes, game } = this.props;
    const { activeStep } = this.state;
    let roles = game.players.map(x => {
      return x.role;
    });
    const getPlayerOfRoles = (role: Roles) => {
      if (role === Roles.werewolf) {
        return this.props.game.players
          .filter(
            player =>
              player.role === role ||
              player.role === Roles.whitewolves ||
              player.role === Roles.demonwolves
          )
          .map(player => player.name)
          .join(", ");
      }
      return this.props.game.players
        .filter(player => player.role === role)
        .map(player => player.name)
        .join(", ");
    };

    roles = Array.from(new Set(roles)).sort();
    let step = 0;

    return (
      <div className={classes.root}>
        <Typography variant="h2" gutterBottom={true}>
          Đêm
        </Typography>
        <Typography variant="subtitle1" gutterBottom={true}>
          Ngày {game.date.day}
        </Typography>
        <Stepper
          className={classes.stepper}
          activeStep={activeStep}
          orientation="vertical"
        >
          {roles.map((x, index) => {
            const thisStep = step;
            step++;
            const tempPlayer: any = game.players.find(
              player => player.role === x
            );
            return (
              <Step key={String(x)}>
                <StepLabel
                  className={classes.stepLabel}
                  // tslint:disable-next-line: jsx-no-lambda
                  onClick={() => this.setActiveStep(thisStep)}
                >
                  {this.roleList[x]} - {getPlayerOfRoles(x)}
                </StepLabel>
                <StepContent>
                  <div className={classes.content}>
                    <ActionDialog player={tempPlayer} role={x} />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={this.handleNext}
                      className={classes.wrapper}
                    >
                      Next
                    </Button>
                  </div>
                </StepContent>
              </Step>
            );
          })}
        </Stepper>
        <div className={classes.wrapper}>
          <Fab
            onClick={this.tickTime}
            component={Link}
            {...({ to: "/result" } as any)}
            color="primary"
          >
            <NavigateNext />
          </Fab>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  game: state.game,
});

export default connect(mapStateToProps, { tickTime })(
  withRoot(withStyles(styles)(Night))
);
