import { makeStyles } from "@material-ui/core/styles";
import { Drawer } from "@material-ui/core";
import DrawerContent from "./drawer-content";

const useStyles = makeStyles(theme => ({
    drawer: {
        [theme.breakpoints.up("md")]: {
            width: "100%",
            flexShrink: 0,
        },
    },
    drawerPaper: {
        width: "100%",
        borderRight: 0,
    },
}));

interface INavDrawer {
    mobileOpen: boolean;
    handleDrawerToggle: () => void;
}

function NavDrawer({ mobileOpen, handleDrawerToggle }: INavDrawer) {
    const classes = useStyles();

    return (
        <Drawer
            variant="temporary"
            anchor="top"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            onClick={handleDrawerToggle}
            classes={{
                paper: classes.drawerPaper,
            }}
            ModalProps={{
                keepMounted: true,
            }}
        >
            <DrawerContent />
        </Drawer>
    );
}

export default NavDrawer;
