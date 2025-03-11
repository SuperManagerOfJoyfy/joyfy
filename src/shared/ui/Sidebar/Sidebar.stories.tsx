import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Sidebar, SidebarProps } from "./Sidebar";
import {
  FiHome,
  FiPlusCircle,
  FiUser,
  FiMessageCircle,
  FiSearch,
  FiBarChart2,
  FiStar,
  FiLogOut,
} from "react-icons/fi";

const meta: Meta<typeof Sidebar> = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "centered",
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const mainItems = [
  { id: "home", title: "Home", path: "/", icon: <FiHome /> },
  { id: "create", title: "Create", path: "/create", icon: <FiPlusCircle /> },
  { id: "profile", title: "My Profile", path: "/profile", icon: <FiUser /> },
  {
    id: "messenger",
    title: "Messenger",
    path: "/messenger",
    icon: <FiMessageCircle />,
  },
  { id: "search", title: "Search", path: "/search", icon: <FiSearch /> },
];

const extraItems = [
  {
    id: "statistics",
    title: "Statistics",
    path: "/statistics",
    icon: <FiBarChart2 />,
  },
  { id: "favorites", title: "Favorites", path: "/favorites", icon: <FiStar /> },
];

const bottomItems = [
  { id: "logout", title: "Log Out", path: "/logout", icon: <FiLogOut /> },
];

export const Default: Story = {
  args: {
    items: [...mainItems, ...extraItems],
    bottomItems: bottomItems,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const Active: Story = {
  args: {
    ...Default.args,
    activeItemId: "home",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
