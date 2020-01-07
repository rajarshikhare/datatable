// @flow
import { withStyles } from "@material-ui/core/styles";
import * as React from "react";
import {
  Paper,
  IconButton,
  OutlinedInput,
  List,
  Button,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import InputAdornment from "@material-ui/core/InputAdornment";
import Grow from "@material-ui/core/Grow";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Checkbox from "@material-ui/core/Checkbox";
import SearchIcon from "@material-ui/icons/Search";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Tooltip from "@material-ui/core/Tooltip";
import { lighten } from "@material-ui/core/styles/colorManipulator";

const styles = theme => ({
  suggestion: {
    position: "absolute",
    zIndex: "1300",
    minWidth: "150px",
    maxWidth: "200px",
    top: "30px",
    padding: theme.spacing(0.5),
    right: "0px"
  },
  container: {
    position: "relative",
  },
  containerActive: {
    backgroundColor: lighten(theme.palette.primary.main, .9),
    color: theme.palette.primary.main
  },
  expandIcon: {
    transition: "transform 200ms cubic-bezier(0.4, 0, 0.2, 1)"
  },
  iconButton: {
    padding: "2px"
  },
  listTag: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    overflowX: "hidden"
  },
  dropButn: {
    display: "flex",
    color: "inherit",
    minWidth: "150px",
    borderRadius: theme.spacing(0),
    padding: theme.spacing(0.5, 1),
    boxShadow: "0 0 0px 0px #0000000f",
    borderBottom: `1px solid`,
    borderColor: "inherit",
    background: "inherit",
    "&:hover": {
      background: theme.palette.background.paper,
      boxShadow: "0 0 0px 0px #0000000f"
    }
  },
  active: {
    backgroundColor: theme.palette.primary.main,
    color: "#ffffff"
  },
  svgBtn: {
    color: "inherit",
    fontSize: "18px",
    transition: "transform .2s",
  },
  listItemIcon: {
    minWidth: theme.spacing(2)
  },
  listTextRoot: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  }
});

const CustTextField = withStyles({
  input: {
    padding: "5px"
  },
  adornedEnd: {
    paddingRight: "0px"
  }
})(OutlinedInput);

class MultiSelectWithSearch extends React.Component {
  constructor(props) {
    super(props);
    //this.aiLogger = new AiLogger();
    this.state = {
      currentValue: "",
      suggestions: props.options,
      showSuggestion: false
    };
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.options.length !== this.props.options.length) {
      this.setState({
        currentValue: "",
        suggestions: this.props.options,
        showSuggestion: false
      });
    }
  }

  handleInputChange = (input) => {
    this.getSuggestions(input).then(suggestions => {
      this.setState({ suggestions: suggestions });
    });
    this.setState({ currentValue: input, showSuggestion: true });
  };

  getSuggestions = (input) => {
    return new Promise(resolve => {
      setTimeout(() => {
        const { options } = this.props;
        const suggestions = options.filter(s => {
          return s.value.toUpperCase().indexOf(input.toUpperCase()) !== -1;
        });
        resolve(suggestions);
      });
    });
  };

  handleHideSuggestion = (event) => {
    this.setState({ showSuggestion: false });
  };

  toggleSuggestion = (event) => {
    this.setState(prevState => ({ showSuggestion: !prevState.showSuggestion }));
  };

  handleClick = (key) => {
    const { handleChange, options } = this.props;
    options.forEach(o => {
      if (key === o.key) {
        o.checked = !o.checked;
      }
    });
    handleChange(options, key);
  };

  render() {
    const {
      classes,
      isDisabled,
      name,
      options,
      className,
      tooltipProps,
      icon
    } = this.props;
    const { currentValue, showSuggestion, suggestions } = this.state;
    const { placement, ...otherTooltipsProps } = tooltipProps;
    const checkedCount = options.filter(o => o.checked).length;
    return (
      <React.Fragment>
        <ClickAwayListener onClickAway={this.handleHideSuggestion}>
          <span className={classes.container}>
            <Tooltip
              {...otherTooltipsProps}
              placement={showSuggestion ? "top" : placement}
            >
              <IconButton
                onClick={this.toggleSuggestion}
              >
                {icon}
              </IconButton>
            </Tooltip>
            {showSuggestion && (
              <Grow in={showSuggestion} style={{ transformOrigin: "0 0" }}>
                <Paper className={classes.suggestion}>
                  <CustTextField
                    autoFocus
                    disabled={isDisabled}
                    onChange={event =>
                      this.handleInputChange(event.target.value)
                    }
                    value={currentValue}
                    variant="outlined"
                    endAdornment={
                      <InputAdornment position="end">
                        {currentValue.length > 0 ? (
                          <IconButton
                            aria-label="Show Suggestions"
                            onClick={e => this.handleInputChange("")}
                            className={classes.iconButton}
                          >
                            <CloseIcon className={classes.expandIcon} />
                          </IconButton>
                        ) : (
                            <SearchIcon className={classes.expandIcon} />
                          )}
                      </InputAdornment>
                    }
                  />
                  <div
                    style={{
                      overflowY: "auto",
                      maxHeight: "300px"
                    }}
                  >
                    <List dense>
                      {suggestions.length !== 0 ? (
                        <React.Fragment>
                          {suggestions.map(s => {
                            const option = options.find(o => o.key === s.key);
                            const checked = option && option.checked;
                            return (
                              <ListItem
                                key={s.key}
                                button
                                onClick={event => this.handleClick(s.key)}
                              >
                                <ListItemIcon
                                  classes={{
                                    root: classes.listItemIcon
                                  }}
                                >
                                  <Checkbox
                                    color="primary"
                                    edge="start"
                                    disableRipple
                                    checked={checked}
                                  />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    <Tooltip title={s.value}>
                                      <Typography variant={"body2"} className={classes.listTextRoot}>
                                        {s.value}
                                      </Typography>
                                    </Tooltip>
                                  }
                                />
                              </ListItem>
                            );
                          })}
                        </React.Fragment>
                      ) : (
                          <ListItem>
                            <ListItemIcon>
                              <SearchIcon />
                            </ListItemIcon>
                            <ListItemText primary={`No ${name} found`} />
                          </ListItem>
                        )}
                    </List>
                  </div>
                </Paper>
              </Grow>
            )}
            </span>
        </ClickAwayListener>
      </React.Fragment>
    );
  }
}

export default withStyles(styles, { withTheme: true })(MultiSelectWithSearch);
