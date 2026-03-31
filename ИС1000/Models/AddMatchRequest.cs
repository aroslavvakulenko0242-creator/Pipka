namespace ИС1000.Models
{
    public class Match
    {
        public int MatchId { get; set; }
        public string HeroName { get; set; }
        public string Position { get; set; }
        public int LoseWin { get; set; }
        public string Item1 { get; set; }
        public string Item2 { get; set; }
        public string Item3 { get; set; }
        public string Item4 { get; set; }
        public string Item5 { get; set; }
        public string Item6 { get; set; }
    }
    public class AddMatchRequest
    {
        public string HeroName { get; set; }
        public string Position { get; set; }
        public int LoseWin { get; set; } // 0 = loss, 1 = win
        public List<string> Items { get; set; } // максимум 6 элементов
    }
}