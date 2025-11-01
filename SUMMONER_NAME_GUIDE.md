# Summoner Name Format Guide

## 📝 How to Enter Your Summoner Name

TimeWarp LoL supports **both formats** for entering your League of Legends account:

---

## Format Options

### ✅ **Option 1: Old Summoner Name (Legacy)**

Just enter your in-game summoner name as-is.

**Examples:**
- `Doublelift`
- `Faker`
- `Tyler1`
- `Your Summoner Name`

**When to use:**
- If your account was created before Riot IDs were introduced
- If you're unsure which format to use (try this first!)

---

### ✅ **Option 2: Riot ID (New Format)**

Enter your Riot ID with the tagline after a `#` symbol.

**Format:** `GameName#TAG`

**Examples:**
- `Doublelift#NA1`
- `Faker#KR1`
- `Tyler1#NA1`
- `YourName#TAG`

**When to use:**
- If your account uses the new Riot ID system
- If the old summoner name doesn't work
- For newer accounts (2020+)

---

## How to Find Your Riot ID

### In League of Legends Client:

1. Open the League client
2. Look at the **top right corner** of the client
3. You'll see your name in format: `GameName#TAG`
4. Example: `Doublelift#NA1`

### In-Game:

1. Press **Tab** during a game
2. Your full Riot ID is shown next to your champion icon
3. Format: `GameName#TAG`

### On Riot's Website:

1. Log in to your Riot Games account
2. Go to account settings
3. Your Riot ID is displayed at the top

---

## Which Format Should I Use?

### **Try Old Format First:**

Most existing accounts work with just the summoner name (without tagline).

**Example:**
```
Summoner Name: Doublelift
Region: NA
Year: 2024
```

### **If That Doesn't Work, Use Riot ID:**

If you get "Player not found", try adding your tagline:

**Example:**
```
Summoner Name: Doublelift#NA1
Region: NA
Year: 2024
```

---

## Common Issues & Solutions

### ❌ "Player not found"

**Possible causes:**
1. **Typo in name** - Check spelling and capitalization
2. **Wrong region** - Make sure you select the correct region
3. **Need tagline** - Try adding `#TAG` to your name
4. **Account has no ranked games** - The app only analyzes ranked matches

**Solutions:**
- Double-check spelling (names are case-sensitive)
- Verify your region selection matches your account
- Try both formats (with and without tagline)
- Make sure you played ranked games in the selected year

---

### ❌ "Invalid Riot ID format"

**Cause:** You entered a Riot ID incorrectly.

**Correct format:** `GameName#TAG`

**Examples:**
- ✅ `Doublelift#NA1` (correct)
- ❌ `Doublelift #NA1` (space before #)
- ❌ `Doublelift# NA1` (space after #)
- ❌ `Doublelift-NA1` (dash instead of #)
- ❌ `#NA1` (missing game name)

---

## Examples by Region

### North America (NA)
- Old: `Doublelift`
- New: `Doublelift#NA1`

### Europe West (EUW)
- Old: `Caps`
- New: `Caps#EUW`

### Korea (KR)
- Old: `Faker`
- New: `Hide on bush#KR1` (note: includes spaces!)

### Brazil (BR)
- Old: `brTT`
- New: `brTT#BR1`

---

## Tips

1. **Case Matters**: `DoubleLift` ≠ `doublelift` ≠ `DOUBLELIFT`
2. **Spaces OK**: `Hide on bush#KR1` (spaces in game name are fine)
3. **Special Characters**: Most special characters work in names
4. **Tagline Required**: If using Riot ID format, you MUST include the tagline after `#`

---

## Testing Your Input

### Quick Test:

1. Open TimeWarp LoL: http://localhost:3001
2. Enter your summoner name (try without tagline first)
3. Select your region
4. Choose a year where you played ranked
5. Click "Generate Year in Review"

**If it works:** ✅ You're all set!

**If "Player not found":** Try adding your tagline (#TAG)

---

## Need More Help?

- Check your name in the League client
- Verify your region selection
- Make sure you played ranked games
- Try both formats (with and without tagline)
- Check [QUICKSTART.md](QUICKSTART.md) for more troubleshooting

---

**Pro Tip:** When in doubt, copy your full name from the League client (including the `#TAG`) and paste it directly into the form!
