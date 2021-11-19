import { Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    duck: {
        backgroundColor: props => props.color,
        borderRadius: 10
    }
})

const Duck = (props) =>  {
    const classes = useStyles(props);
    const { size, color, quote } = props;
    
    const DUCK_SIZE = size ? size : 120;

    const onClick = () => {
        alert(quote);
    }

    return (
        <Grid item onClick={onClick}>
            <img
                src={'duck.png'}
                alt={`${color} duck`}
                height={DUCK_SIZE}
                width={DUCK_SIZE}
                className={classes.duck}
            />
        </Grid>
    );
}

export default Duck;