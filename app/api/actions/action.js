"use server";
import { cookies } from "next/headers";

const auth = cookies().get("ClickupToken").value;
 
export const teams = async () => {
    const resp = await fetch(`https://api.clickup.com/api/v2/team`, {
        method: "GET",
        headers: { Authorization: auth },
    });

    const teams = await resp.json();
    return teams;
};
export const spaces = async () => {
    const query = new URLSearchParams({ archived: "false" }).toString();
    const res = await teams();
    const data = [];
    for (let i = 0; i < res.teams.length; i++) {
        const teamId = res.teams[i]?.id;

        const resp = await fetch(
            `https://api.clickup.com/api/v2/team/${teamId}/space?${query}`,
            {
                method: "GET",
                headers: { Authorization: auth },
            }
        );
        const spaces = await resp.json();
        // console.log("spaces==>",spaces.spaces);
        data.push(spaces);
    }

    return data;
};
export const folders = async () => {
    const res = await spaces();
    // console.log("spaces<==", );
    const query = new URLSearchParams({ archived: "false" }).toString();
    const data = [];
    for (let i = 0; i < res[0].spaces?.length; i++) {
        const spaceId = res[0].spaces[i]?.id;

        const resp = await fetch(
            `https://api.clickup.com/api/v2/space/${spaceId}/folder?${query}`,
            {
                method: "GET",
                headers: { Authorization: auth },
            }
        );
        const folders = await resp.json();

        data.push(folders);
    }
    return data;
};

export const lists = async () => {
    const res = await folders();
    // console.log("folders<==", res);
    let list = [];
    let data = [];
    const query = new URLSearchParams({ archived: "false" }).toString();
    for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < res[i].folders.length; j++) {
            const folderId = res[i].folders[j].id;
            const resp = await fetch(
                `https://api.clickup.com/api/v2/folder/${folderId}/list?${query}`,
                {
                    method: "GET",
                    headers: { Authorization: auth },
                }
            );
            const lists = await resp.json();
            list.push(lists);
        }
        data.push(list);
    }
    return data;
};

export const getuser = async () => {
    const resp = await fetch(`https://api.clickup.com/api/v2/user`, {
        method: "GET",
        headers: {
            Authorization: auth,
        },
    });
    const data = await resp.json();
    return data;
};
export const getTasks = async () => {
    const response = await getuser();
    const res = await lists();
    const assigneeID = response.user.id;
    const tasks = [];
    for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < res[i].length; j++) {
            for (let r = 0; r < res[i][j].lists.length; r++) {
                const listId = res[i][j].lists[r].id;
                const resp = await fetch(
                    `https://api.clickup.com/api/v2/list/${listId}/task?assignees[]=${assigneeID}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: auth,
                        },
                    }
                );
                const task = await resp.json();

                task.tasks.length > 0 && tasks.push(task);
            }
        }
    }
    return tasks;
};
