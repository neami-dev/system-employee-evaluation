"use client";
import { db, usersCollectionRef } from "@/firebase/firebase-config";
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDocs,
} from "@firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth } from "@/firebase/firebase-config";

// export default function test() {
//     useEffect(() => {
//         const getUsers = async () => {
//             const data = await getDocs(usersCollectionRef);
//             console.log("data");
//             console.log(
//                 data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
//             );
//         };
//         console.log("auth : ",auth);
//         getUsers();
//     }, []);

//     return <>k.hhhjh</>;
// }
export default function test() {
    // async function run() {
    //     const query = new URLSearchParams({
    //         client_id: "MAZ8MEW6LPS9XVVGM81FEX9J3XDEWSS3",
    //         client_secret:
    //             "G3Q78H1ZNQZRMOSRL7QKD5AWY7CDSKWHKH1XHN27I33FISWEOPYZKK97KAPQIB7U",
    //         code: "string",
    //     }).toString();

    //     const resp = await fetch(
    //         `https://api.clickup.com/api/v2/oauth/token?${query}`,
    //         { method: "POST" }
    //     );

    //     const data = await resp.text();
    //     console.log("data", data);
    // }
    const auth = "pk_62619802_DUTAWSY7URAR8RWO7PPOR7QFCT8R0K8J";

    // fetch(`https://api.clickup.com/api/v2/user`, {
    //     method: "GET",
    //     headers: {
    //         Authorization: auth,
    //     },
    // })
    //     .then((response) => {
    //         return response.json();
    //     })
    //     .then((res) => console.log(res));

    // async function run() {

    //     const listId = "901502971367";
    //     const resp = await fetch(
    //         `https://api.clickup.com/api/v2/list/${listId}/task?assignees[]=62621353`,
    //         {
    //             method: "GET",
    //             headers: {
    //                 Authorization: auth,
    //             },
    //         }
    //     );

    //     const data = await resp.json();
    //     console.log(data);
    // }

    // run();

    // async function run() {
    //     const query = new URLSearchParams({
    //         team_id: "90151226800",
    //         group_ids: "C9C58BE9-7C73-4002-A6A9-310014852858",
    //     }).toString();

    //     const resp = await fetch(`https://api.clickup.com/api/v2/group?${query}`, {
    //         method: "GET",
    //         headers: {
    //             Authorization: "pk_62619802_1BCA5HMVGZ772RFGSS18DSY357RAREAB",
    //         },
    //     });

    //     const data = await resp.json();
    //     console.log(data);
    // }

    // run();

    // async function run() {

    //   const query = new URLSearchParams({archived: 'false'}).toString();

    //   const teamId = 90151226800;
    //   const resp = await fetch(
    //     `https://api.clickup.com/api/v2/team/${teamId}/space?${query}`,
    //     {
    //       method: 'GET',
    //       headers: {
    //         Authorization: auth
    //       }
    //     }
    //   );

    //   const data = await resp.text();
    //   console.log(data);
    // }

    // run();

    // lists
    // async function run() {
    //   const query = new URLSearchParams({archived: 'false'}).toString();

    //   const folderId = 90152173270;
    //   const resp = await fetch(
    //     `https://api.clickup.com/api/v2/folder/${folderId}/list`,
    //     {
    //       method: 'GET',
    //       headers: {Authorization: auth}
    //     }
    //   );

    //   const data = await resp.json();
    //   console.log(data);
    // }

    // run();

    // async function run() {
    //     const query = new URLSearchParams({ archived: "false" }).toString();

    //     const teamId = 9015373700;
    //     const resp = await fetch(
    //         `https://api.clickup.com/api/v2/team/${teamId}/space?${query}`,
    //         {
    //             method: "GET",
    //             headers: { Authorization: auth },
    //         }
    //     );

    //     const data = await resp.json();
    //     console.log(data);
    // }

    // run();
    async function run() {
        const query = new URLSearchParams({archived: 'false'}).toString();
      
        const spaceId =
        90151292656;
        const resp = await fetch(
          `https://api.clickup.com/api/v2/space/${spaceId}/folder?${query}`,
          {
            method: 'GET',
            headers: {Authorization: auth}
          }
        );
      
        const data = await resp.json();
        console.log(data);
      }
      
      run();
    // async function run() {
    //     const resp = await fetch(`https://api.clickup.com/api/v2/team`, {
    //         method: "GET",
    //         headers: { Authorization: auth },
    //     });

    //     const data = await resp.json();
    //     console.log(data);
    // }

    // run();
    // async function run() {
    //   const query = new URLSearchParams({
    //     team_id: '123',
    //     group_ids: 'C9C58BE9-7C73-4002-A6A9-310014852858'
    //   }).toString();

    //   const resp = await fetch(
    //     `https://api.clickup.com/api/v2/group?${query}`,
    //     {
    //       method: 'GET',
    //       headers: {Authorization: auth}
    //     }
    //   );

    //   const data = await resp.text();
    //   console.log(data);
    // }

    // run();
}
