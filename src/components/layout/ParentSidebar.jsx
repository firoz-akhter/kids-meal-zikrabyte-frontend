"use client";

import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Divider,
  Avatar,
} from "@mui/material";
import {
  Dashboard,
  ChildCare,
  Subscriptions,
  LocalShipping,
  Payment,
  Person,
  Logout,
} from "@mui/icons-material";
import { useRouter, usePathname } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
import { useAuth } from "../../context/AuthContext";

const drawerWidth = 260;

export default function ParentSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/parent/dashboard" },
    { text: "My Children", icon: <ChildCare />, path: "/parent/children" },
    {
      text: "Subscriptions",
      icon: <Subscriptions />,
      path: "/parent/subscriptions",
    },
    { text: "Deliveries", icon: <LocalShipping />, path: "/parent/deliveries" },
    { text: "Payments", icon: <Payment />, path: "/parent/payments" },
    { text: "Profile", icon: <Person />, path: "/parent/profile" },
  ];

  const handleNavigation = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      {/* Logo/Brand */}
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" color="primary">
          🍎 Kids Meal
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Parent Portal
        </Typography>
      </Box>

      <Divider />

      {/* User Info */}
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ bgcolor: "primary.main" }}>
          {user?.name?.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {user?.email}
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ flex: 1, px: 1, py: 2 }}>
        {menuItems.map((item) => {
          const isActive =
            pathname === item.path || pathname.startsWith(item.path + "/");
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isActive}
                sx={{
                  borderRadius: 2,
                  "&.Mui-selected": {
                    bgcolor: "primary.main",
                    color: "white",
                    "&:hover": {
                      bgcolor: "primary.dark",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "white" : "text.secondary",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      {/* Logout */}
      <List sx={{ px: 1, py: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            sx={{
              borderRadius: 2,
              color: "error.main",
              "&:hover": {
                bgcolor: "error.light",
                color: "white",
                "& .MuiListItemIcon-root": {
                  color: "white",
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: "error.main", minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
}

// "use client";

// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Toolbar,
//   Divider,
//   Box,
//   Typography,
// } from "@mui/material";
// import {
//   Dashboard,
//   ChildCare,
//   Subscriptions,
//   LocalShipping,
//   Payment,
//   Person,
//   Restaurant,
// } from "@mui/icons-material";
// import { usePathname, useRouter } from "next/navigation";

// const DRAWER_WIDTH = 240;

// const menuItems = [
//   {
//     text: "Dashboard",
//     icon: <Dashboard />,
//     path: "/parent/dashboard",
//   },
//   {
//     text: "My Children",
//     icon: <ChildCare />,
//     path: "/parent/children",
//   },
//   {
//     text: "Subscriptions",
//     icon: <Subscriptions />,
//     path: "/parent/subscriptions",
//   },
//   {
//     text: "Menu",
//     icon: <Restaurant />,
//     path: "/parent/menu",
//     divider: true,
//   },
//   {
//     text: "Deliveries",
//     icon: <LocalShipping />,
//     path: "/parent/deliveries",
//   },
//   {
//     text: "Payments",
//     icon: <Payment />,
//     path: "/parent/payments",
//     divider: true,
//   },
//   {
//     text: "Profile",
//     icon: <Person />,
//     path: "/parent/profile",
//   },
// ];

// interface ParentSidebarProps {
//   open?: boolean;
//   onClose?: () => void;
//   variant?: "permanent" | "temporary";
// }

// export default function ParentSidebar({
//   open = true,
//   onClose,
//   variant = "permanent",
// }: ParentSidebarProps) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const handleNavigation = (path: string) => {
//     router.push(path);
//     if (variant === "temporary" && onClose) {
//       onClose();
//     }
//   };

//   const drawerContent = (
//     <Box>
//       <Toolbar>
//         <Typography variant="h6" noWrap component="div">
//           Parent Portal
//         </Typography>
//       </Toolbar>
//       <Divider />
//       <List>
//         {menuItems.map((item) => (
//           <Box key={item.text}>
//             <ListItem disablePadding>
//               <ListItemButton
//                 selected={pathname === item.path}
//                 onClick={() => handleNavigation(item.path)}
//                 sx={{
//                   "&.Mui-selected": {
//                     backgroundColor: "primary.light",
//                     color: "primary.main",
//                     "&:hover": {
//                       backgroundColor: "primary.light",
//                     },
//                   },
//                 }}
//               >
//                 <ListItemIcon
//                   sx={{
//                     color: pathname === item.path ? "primary.main" : "inherit",
//                   }}
//                 >
//                   {item.icon}
//                 </ListItemIcon>
//                 <ListItemText primary={item.text} />
//               </ListItemButton>
//             </ListItem>
//             {item.divider && <Divider sx={{ my: 1 }} />}
//           </Box>
//         ))}
//       </List>
//     </Box>
//   );

//   return (
//     <Drawer
//       variant={variant}
//       open={open}
//       onClose={onClose}
//       sx={{
//         width: DRAWER_WIDTH,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": {
//           width: DRAWER_WIDTH,
//           boxSizing: "border-box",
//         },
//       }}
//     >
//       {drawerContent}
//     </Drawer>
//   );
// }
