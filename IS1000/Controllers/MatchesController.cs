using Microsoft.AspNetCore.Mvc;
using System.Linq;
using System.Threading.Tasks;
using ИС1000.Models;
using ИС1000.Services;


namespace ИС1000.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchesController : ControllerBase
    {
        private readonly DatabaseService _db;

        public MatchesController(DatabaseService db)
        {
            _db = db;
        }

        // POST /api/matches
        [HttpPost]
        public async Task<IActionResult> AddMatch([FromBody] AddMatchRequest request)
        {
            // Проверка обязательных полей
            if (string.IsNullOrWhiteSpace(request.HeroName) ||
                string.IsNullOrWhiteSpace(request.Position) ||
                request.LoseWin < 0 || request.LoseWin > 1)
            {
                return BadRequest("Missing required fields: HeroName, Position, LoseWin (0 or 1)");
            }

            // Преобразуем AddMatchRequest в Match
            var match = new Match
            {
                HeroName = request.HeroName,
                Position = request.Position,
                LoseWin = request.LoseWin
            };

            // Заполняем предметы (максимум 6)
            var items = request.Items ?? new List<string>();
            match.Item1 = items.Count > 0 ? items[0] : null;
            match.Item2 = items.Count > 1 ? items[1] : null;
            match.Item3 = items.Count > 2 ? items[2] : null;
            match.Item4 = items.Count > 3 ? items[3] : null;
            match.Item5 = items.Count > 4 ? items[4] : null;
            match.Item6 = items.Count > 5 ? items[5] : null;

            int newId = await _db.AddMatchAsync(match);
            // Возвращаем 201 Created с URL нового ресурса
            return CreatedAtAction(nameof(GetMatch), new { id = newId }, match);
        }

        // GET /api/matches/{id} – для CreatedAtAction
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMatch(int id)
        {
            // Здесь можно реализовать получение одного матча, если нужно
            // Для простоты вернём 404, так как у нас нет отдельного метода
            return NotFound();
        }

        // GET /api/meta/heroes?position=Carry
        [HttpGet("~/api/meta/heroes")]
        public async Task<IActionResult> GetTopHeroes([FromQuery] string position)
        {
            if (string.IsNullOrWhiteSpace(position))
            {
                return BadRequest("Position is required");
            }

            var heroes = await _db.GetTopHeroesByPositionAsync(position);
            // Возвращаем массив объектов с полями name и winrate
            var result = heroes.Select(h => new { name = h.HeroName, winrate = h.WinRate });
            return Ok(result);
        }

        // GET /api/hero/{heroName}/recent
        [HttpGet("~/api/hero/{heroName}/recent")]
        public async Task<IActionResult> GetHeroRecentMatches(string heroName)
        {
            if (string.IsNullOrWhiteSpace(heroName))
            {
                return BadRequest("Hero name is required");
            }

            var matches = await _db.GetRecentMatchesByHeroAsync(heroName, 10);

            // Преобразуем в формат, ожидаемый фронтендом:
            // { result: "Win" или "Loss", items: ["Item1", "Item2", ...] }
            var games = matches.Select(m => new
            {
                result = m.LoseWin == 1 ? "Win" : "Loss",
                items = new[] { m.Item1, m.Item2, m.Item3, m.Item4, m.Item5, m.Item6 }
                         .Where(i => !string.IsNullOrEmpty(i))
                         .ToList()
            });

            return Ok(games);
        }
    }
}