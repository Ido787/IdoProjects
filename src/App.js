import { Grid, makeStyles, Typography } from "@material-ui/core";
import DuckContainer from './DuckContainer';

const useStyles = makeStyles(() => ({
  container: {
    marginTop: 5,
  },
  title: {
    border: '0.5px solid blue',
    borderRadius: 4,
  },
}))

const App = () =>  {
  const classes = useStyles();

  return (
    <Grid
      container
      className={classes.container}
      alignItems={'center'}
      direction={'column'}
      spacing={2}
    >
      <Grid item >
        <Typography className={classes.title} variant={'h1'}>Squack!</Typography>
      </Grid>
      <Grid item className={classes.content}>
        <Grid item container spacing={2} direction={'column'}>
          <DuckContainer />
        </Grid>
        <Grid item />
      </Grid>
    </Grid>
  );
}

export default App;