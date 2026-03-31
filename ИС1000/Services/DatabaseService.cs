using Microsoft.Data.Sqlite;
using Dapper;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ИС1000.Models;

namespace ИС1000.Services
{
    public class DatabaseService
    {
        private readonly string _connectionString;

        public DatabaseService(string dbFilePath)
        {
            _connectionString = $"Data Source={dbFilePath}";
        }

        // Добавление матча (принимает объект Match)
        public async Task<int> AddMatchAsync(Match match)
        {
            const string sql = @"
                INSERT INTO Matches (HeroName, Position, Lose_win, Item1, Item2, Item3, Item4, Item5, Item6)
                VALUES (@HeroName, @Position, @LoseWin, @Item1, @Item2, @Item3, @Item4, @Item5, @Item6);
                SELECT last_insert_rowid();";

            using var connection = new SqliteConnection(_connectionString);
            return await connection.ExecuteScalarAsync<int>(sql, match);
        }

        // Получение топ-5 героев по позиции
        public async Task<IEnumerable<(string HeroName, double WinRate)>> GetTopHeroesByPositionAsync(string position, int top = 5)
        {
            const string sql = @"
        SELECT 
            HeroName,
            COUNT(*) AS TotalMatches,
            SUM(CASE WHEN Lose_win = 1 THEN 1 ELSE 0 END) AS Wins
        FROM Matches
        WHERE Position = @position
        GROUP BY HeroName
        HAVING TotalMatches >= 3   -- Минимум 3 игры для статистики (можно изменить)
        ORDER BY (Wins * 1.0 / TotalMatches) DESC
        LIMIT @top";

            using var connection = new SqliteConnection(_connectionString);
            var results = await connection.QueryAsync<dynamic>(sql, new { position, top });

            // Преобразуем результат в список кортежей (имя героя, винрейт в процентах)
            return results.Select(r =>
            {
                double wins = Convert.ToDouble(r.Wins);
                double total = Convert.ToDouble(r.TotalMatches);
                double winrate = Math.Round(wins / total * 100, 1);
                return (HeroName: (string)r.HeroName, WinRate: winrate);
            });
        }

        // Получение последних игр героя (с сортировкой по убыванию MatchID)
        // Получение последних игр героя (с сортировкой по убыванию MatchID)
        public async Task<IEnumerable<Match>> GetRecentMatchesByHeroAsync(string heroName, int count = 10)
        {
            const string sql = @"
        SELECT MatchID, HeroName, Position, Lose_win as LoseWin, Item1, Item2, Item3, Item4, Item5, Item6
        FROM Matches
        WHERE HeroName = @heroName
        ORDER BY MatchID DESC
        LIMIT @count";

            using var connection = new SqliteConnection(_connectionString);
            return await connection.QueryAsync<Match>(sql, new { heroName, count });
        }
    }
}