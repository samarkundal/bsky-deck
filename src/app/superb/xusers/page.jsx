import React from 'react';

const fetchUsersData = async () => {
  const res = await fetch('http://localhost:3040/api/superb/xusers');
  return res.json();
};

export default async function page() {
  const users = await fetchUsersData();
  // console.log(users[0]);
  return (
    <div className="superb-xusers-page">
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Followers</th>
            <th>Interactions</th>
          </tr>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.followers_count}</td>
              <td>{user.interactions}</td>
              <td>
                <a target="_blank" href={`https://x.com/${user.screen_name}`}>
                  View
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
