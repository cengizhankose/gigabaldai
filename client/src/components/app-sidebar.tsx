import { useQuery } from "@tanstack/react-query";
import info from "@/lib/info.json";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
} from "@/components/ui/sidebar";
import { apiClient } from "@/lib/api";
import { NavLink, useLocation } from "react-router";
import type { UUID } from "@elizaos/core";
import { User } from "lucide-react";
import ConnectionStatus from "./connection-status";

export function AppSidebar() {
    const location = useLocation();
    const query = useQuery({
        queryKey: ["agents"],
        queryFn: () => apiClient.getAgents(),
        refetchInterval: 5_000,
    });
    console.log("🚀 ~ AppSidebar ~ query:", query);

    const agents = query?.data?.agents;

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size={null} asChild>
                            <NavLink to="/">
                                <img
                                    alt="icon"
                                    src="/icon.jpeg"
                                    width="100%"
                                    height="100%"
                                    className="size-16 rounded-full mr-2"
                                />

                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">
                                        @gigabaldai
                                    </span>
                                    <span className="">v{info?.version}</span>
                                </div>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Agents</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {query?.isPending || !query?.isFetched ? (
                                <div>
                                    {Array.from({ length: 5 }).map(
                                        (_, _index) => (
                                            <SidebarMenuItem
                                                key={"skeleton-item"}
                                            >
                                                <SidebarMenuSkeleton />
                                            </SidebarMenuItem>
                                        )
                                    )}
                                </div>
                            ) : (
                                <div>
                                    {agents?.map(
                                        (agent: { id: UUID; name: string }) => (
                                            <SidebarMenuItem key={agent.id}>
                                                <NavLink
                                                    to={`/chat/${agent.id}`}
                                                >
                                                    <SidebarMenuButton
                                                        isActive={location.pathname.includes(
                                                            agent.id
                                                        )}
                                                    >
                                                        <User />
                                                        <span>
                                                            {agent.name}
                                                        </span>
                                                    </SidebarMenuButton>
                                                </NavLink>
                                            </SidebarMenuItem>
                                        )
                                    )}
                                </div>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    {/* <SidebarMenuItem>
                        <NavLink
                            to="https://elizaos.github.io/eliza/docs/intro/"
                            target="_blank"
                        >
                            <SidebarMenuButton>
                                <Book /> Documentation
                            </SidebarMenuButton>
                        </NavLink>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuButton disabled>
                            <Cog /> Settings
                        </SidebarMenuButton>
                    </SidebarMenuItem> */}
                    <ConnectionStatus />
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
