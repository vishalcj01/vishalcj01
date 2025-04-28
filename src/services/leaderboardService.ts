export async function getLeaderboardData(sortBy: string) {
  try {
    // Simulated data (in-memory array)
    const users = [
      { id: 1, name: 'Alice', xp: 1500, level: 10 },
      { id: 2, name: 'Bob', xp: 1800, level: 12 },
      { id: 3, name: 'Charlie', xp: 1200, level: 8 },
      { id: 4, name: 'Dave', xp: 1300, level: 9 },
      { id: 5, name: 'Eve', xp: 2000, level: 15 },
    ];

    // Sorting users based on the 'sortBy' field (default is 'xp')
    const sortedUsers = users.sort((a: any, b: any) => {
      const aValue = a[sortBy] ?? 0;
      const bValue = b[sortBy] ?? 0;

      if (typeof aValue === 'string') {
        return aValue.localeCompare(bValue); // For string fields like names
      }

      return bValue - aValue; // For number fields like 'xp'
    });

    // Returning the leaderboard data (e.g., id, name, xp, level)
    return sortedUsers.map((user: any) => ({
      id: user.id,
      name: user.name,
      xp: user.xp,
      level: user.level,
    }));
  } catch (error) {
    console.error('Error in getLeaderboardData:', error);
    throw new Error('Failed to fetch leaderboard data.');
  }
}
