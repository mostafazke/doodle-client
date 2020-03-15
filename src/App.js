import React, { useState, useEffect } from "react";
import AppBar from "@material-ui/core/AppBar";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CircularProgress from "@material-ui/core/CircularProgress";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Lightbox from "lightbox-react";
import "lightbox-react/style.css";
// SERVICES
import productService from "./services/productService";
const useStyles = makeStyles(theme => ({
  icon: {
    marginRight: theme.spacing(2)
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6)
  },
  heroButtons: {
    marginTop: theme.spacing(4)
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8)
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
    backgroundSize: "contain"
  },
  cardContent: {
    flexGrow: 1
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6)
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));
const generateYears = startYear => {
  let currentYear = new Date().getFullYear(),
    years = [];
  startYear = startYear || 1998;
  while (startYear <= currentYear) {
    years.push(startYear++);
  }
  return years;
};
const years = generateYears(1998);
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function App() {
  const classes = useStyles();
  const [doodles, setDoodles] = useState([]);
  const [month, setMonth] = React.useState(1);
  const [year, setYear] = React.useState(2011);
  const [loading, setLoading] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [photo, setPhoto] = React.useState("");

  useEffect(() => {
    if (!doodles.length) {
      getDoodles(year, month);
    }
  });
  const getDoodles = async (year, month) => {
    let res = await productService.getAll(year, month);
    setDoodles(res);
    setLoading(false);
  };

  const handleMonths = event => {
    setMonth(event.target.value);
    setDoodles([]);
    setLoading(true);
  };
  const handleYears = event => {
    setYear(event.target.value);
    setDoodles([]);
    setLoading(true);
  };
  const handleLightBox = (isOpen, src = "") => {
    setIsOpen(isOpen);
    setPhoto(src);
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Doodle
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="md">
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="monthes-label">Month</InputLabel>
                    <Select
                      labelId="monthes-label"
                      id="monthes"
                      value={month}
                      onChange={handleMonths}
                    >
                      {months.map((month, index) => (
                        <MenuItem key={index} value={index + 1}>
                          {month}
                        </MenuItem>
                      ))}
                      {/* <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem> */}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl className={classes.formControl}>
                    <InputLabel id="years-label">Years</InputLabel>
                    <Select
                      labelId="years-label"
                      id="years"
                      value={year}
                      onChange={handleYears}
                    >
                      {years.map((year, index) => (
                        <MenuItem key={index} value={year}>
                          {year}
                        </MenuItem>
                      ))}
                      {/* <MenuItem value={20}>Twenty</MenuItem>
                      <MenuItem value={30}>Thirty</MenuItem> */}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="lg">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {[]
              .concat(doodles)

              .sort((a, b) =>
                a.run_date_array[2] > b.run_date_array[2] ? 1 : -1
              )
              .map(doodle => (
                <Grid item key={doodle.name} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardMedia
                      onClick={() =>
                        handleLightBox(true, doodle.url || doodle.high_res_url)
                      }
                      className={classes.cardMedia}
                      image={doodle.url || doodle.high_res_url}
                      title={doodle.title}
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {(doodle.translations &&
                          doodle.translations.ar &&
                          doodle.translations.ar.hover_text) ||
                          doodle.title}
                      </Typography>
                      <Typography>
                        {new Date(
                          doodle.run_date_array[0],
                          doodle.run_date_array[1] - 1,
                          doodle.run_date_array[2]
                        ).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                    {/* <CardActions>
                    <Button size="small" color="primary">
                      View
                    </Button>
                    <Button size="small" color="primary">
                      Edit
                    </Button>
                  </CardActions> */}
                  </Card>
                </Grid>
              ))}
          </Grid>
        </Container>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
        <Typography variant="h6" align="center" gutterBottom>
          {loading && <CircularProgress />}

          {/* Doodle */}
        </Typography>
        {/* <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Something here to give the footer a purpose!
        </Typography> */}
      </footer>
      {/* End footer*/}
      {isOpen && (
        <Lightbox
          mainSrc={photo}
          onCloseRequest={() => handleLightBox(false)}
        />
      )}
    </React.Fragment>
  );
}

export default App;
