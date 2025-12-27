const puppeteer = require("puppeteer");
const { Client } = require("@notionhq/client");

// ===== 対象音源URL（複数OK）=====
const TARGET_URLS = [
  "https://www.tiktok.com/music/アザトカワイイ-6866985955195095041?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/キュン-6671149648587000577?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ドレミソラシド-6708510031265925890?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/君しか勝たん-6964208378823936002?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/こんなに好きになっちゃっていいの-6743044257105315845?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/君はハニーデュー-7357926372448897040?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/月と星が踊るMidnight-7151328849345677313?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ソンナコトナイヨ-6794657296640116738?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/僕なんか-7096717578046801922?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/One-choice-7218033458566662145?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/絶対的第六感-7402495779992340497?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/青春の馬-6794657296644311041?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/卒業写真だけが知ってる-7444835368492845073?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ってか-7018423079982336001?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Love-yourself-7502079435639293953?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Am-I-ready-7254493072616065026?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/お願いバッハ-7541300538768640017?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/君は０から１になれ-7293817448413956097?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ブルーベリー＆ラズベリー-7151328848812984322?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/見たことない魔物-7254493072616081410?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/世界にはThank-youが溢れている-6961610718529456129?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/日向坂-6875321808392816641?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/JOYFUL-LOVE-6748447109390796806?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ホントの時間-6743044257143064581?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/君のため何ができるだろう-6794657296640116737?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/シーラカンス-7218033459771246594?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Overture-6875314917419780098?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/キツネ-6748411439561574406?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/アディショナルタイム-7018423079936198657?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/僕に続け-7351619510329346049?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/どうするどうするどうする-6961610718496114689?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/HEYOHISAMA-7151328847550498817?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/飛行機雲ができる理由-7096717578269116417?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ゴーフルと君-7096717578759849985?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ジャーマンアイリス-7499416543852595201?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Right-6961610718600759297?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/雨が降ったって-7356537207594321936?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/一番好きだとみんなに言っていた小説のタイトルを思い出せない-6743044257235339270?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/足の小指を箪笥の角にぶつけた-7460176323244460049?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/あくびLetter-7018423080192051202?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/この夏をジャムにしよう-6875314916882909186?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/好きということは-6794657297760012289?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/声の足跡-6961610718479124482?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/錆つかない剣を持て-7353105607601227793?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/真夜中の懺悔大会-7096717578994714626?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ガラス窓が汚れてる-7254493072616048642?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/まさか-偶然-6743044257189201925?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ロッククライミング-7295600519976503297?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/夕陽Dance-7405168082718754833?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/友よ-一番星だ-7218033460009519106?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/誰よりも高く跳べ-2020-6875314915960162306?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/海風とわがまま-7502079435639392257?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/空飛ぶ車-7542841504269387792?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/NO-WAR-in-the-future-2020-6870188493369247746?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/SUZUKA-7457467008340641808?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/約束の卵-2020-6875314915926607874?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/やさしさが邪魔をする-6748411440845031429?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ときめき草-6748447110007359494?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/沈黙が愛なら-6748489042590959622?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/恋した魚は空を飛ぶ-7096717579221207041?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/その他大勢タイプ-7151328848548743170?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/夢は何歳まで-7018423080137525249?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/JOYFUL-LOVE-off-vocal-ver-6748489043496945669?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/My-fans-6875314918367692801?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/恋は逃げ足が早い-7218033458822514689?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/孤独な瞬間-7151328847940569089?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Footsteps-6748447109659232261?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/知らないうちに愛されていた-7096717579456088065?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/パクチー-ピーマン-グリーンピース-7218033459522963458?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/See-Through-6870188489049131010?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/窓を開けなくても-6794657303179036673?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/君を覚えてない-7405780704602671105?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/10秒天使-7151328848225765378?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/何度でも何度でも-7018423080028473346?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/DashRush-6748411440870197254?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/思いがけないダブルレインボー-7018423080087209985?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/耳に落ちる涙-6748447109583751174?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ママのドレス-6782140812126849025?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Cage-6748411440765339654?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/一生一度の夏-7151328849073014785?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/川は流れる-6875321808371877890?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/青春ポップコーン-7295600519976683521?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/酸っぱい自己嫌悪-7018423079890880513?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/What-you-like-7502079435639359489?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/膨大な夢に押し潰されて-6961610718625941506?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/言葉の限界-7544057073248782353?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/あの娘にグイグイ-7460200814688290817?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/君は逆立ちできるか-7254493072616015874?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/永遠のソフィア-7411035325940828177?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/キュン-off-vocal-ver-6748489042666457093?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/もうこんなに好きになれない-7096717578508175362?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/嘆きのDelete-6961610718655301633?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/孤独たちよ-7460200814688274433?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/愛はこっちのものだ-7218033459049007105?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/恋とあんバター-7357926372448946192?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/自販機と主体性-7295600519976437761?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Expected-value-7548289114752370689?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/My-god-6875314917436557314?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/最初の白夜-7295600519976667137?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/妄想コスモス-7411035325940860945?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/愛のひきこもり-7254493072616032258?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/43年待ちのコロッケ-7460200814688307201?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/骨組みだらけの夏休み-7254493072615999490?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ナゼー-6875314916538976258?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ただがむしゃらに-6870188485953718273?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ハロウィンのカボチャが割れた-2025-7548289114752354305?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/愛はこっちのものだ-2025-7548289114752436225?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/雪は降る-心の世界に-7411035325940877329?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/夜明けのスピード-7357926372448962576?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Instead-of-you-7460200814688323585?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/どっちが先に言う-7411035325940844561?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/You’re-in-my-way-7218033459288901633?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/やらかした-7502079435639343105?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/あのね-そのね-7502079435639375873?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/月と星が踊るMidnight-off-vocal-ver-7218548958329571330?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/どうして雨だと言ったんだろう-6870188491402168322?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/どこまでが道なんだ-7357926372448929808?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/接触と感情-7254493072616097794?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/君しか勝たん-off-vocal-ver-7018422816827525121?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/沈黙が愛なら-off-vocal-ver-6748489043022972934?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/君はハニーデュー-off-vocal-ver-7410320613519427600?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ってか-off-vocal-ver-7099316722636687361?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/One-choice-off-vocal-ver-7254839329414907906?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/知らないうちに愛されていた-off-vocal-ver-7153590348030150658?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ドレミソラシド-off-vocal-ver-6940353877393295362?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/僕なんか-off-vocal-ver-7153590347401168898?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/こんなに好きになっちゃっていいの-off-vocal-ver-6940354044523218945?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/アディショナルタイム-off-vocal-ver-7099316723148425217?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ホントの時間-off-vocal-ver-6940354044997961730?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/夕陽Dance-off-vocal-ver-7460381216882362384?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/HEYOHISAMA-off-vocal-ver-7218548958568663042?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ライバル多すぎ問題-7548289114752419841?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/You-are-forever-7502079435639326721?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/絶対的第六感-off-vocal-ver-7460381216882329616?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/友よ-一番星だ-off-vocal-ver-7254839329414940674?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ガラス窓が汚れてる-off-vocal-ver-7360545486547208208?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/誰よりも高く跳べ2020-Live-from-Happy-Train-Tour-2023-7295600519976470529?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ソンナコトナイヨ-off-vocal-ver-6961621018990151681?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/足の小指を箪笥の角にぶつけた-off-vocal-ver-7502401552826419216?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Am-I-ready-off-vocal-ver-7360543491062564865?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/飛行機雲ができる理由-off-vocal-ver-7153590347744937986?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/青春の馬-off-vocal-ver-6961621019056408578?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ジャーマンアイリス-off-vocal-ver-7545448312464918529?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/恋は逃げ足が早い-off-vocal-ver-7254839329414924290?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/膨大な夢に押し潰されて-off-vocal-ver-7018422814122199041?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/声の足跡-off-vocal-ver-7018422817762871298?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/川は流れる-off-vocal-ver-6940354045395601409?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/卒業写真だけが知ってる-off-vocal-ver-7502401552826484752?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/僕に続け-off-vocal-ver-7410320613519362064?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/見たことない魔物-off-vocal-ver-7360545486547191824?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/JOYFUL-LOVE-Live-from-Happy-Train-Tour-2023-7295600519976749057?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/一生一度の夏-off-vocal-ver-7218548957167798274?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/DashRush-off-vocal-ver-6940353878296184834?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/キツネ-off-vocal-ver-6940353877841594370?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Love-yourself-off-vocal-ver-7545448312465000449?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/錆つかない剣を持て-off-vocal-ver-7410320613519443984?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/君のため何ができるだろう-off-vocal-ver-6961621018218366977?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/海風とわがまま-off-vocal-ver-7545448312464934913?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/SUZUKA-off-vocal-ver-7502401552826501136?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/君を覚えてない-off-vocal-ver-7460381216882346000?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/キツネ-Live-from-Happy-Train-Tour-2023-7295600519976454145?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/何度でも何度でも-off-vocal-ver-7099316722875795457?is_from_webapp=1&sender_device=pc",
];

(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: "new",
  });

  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  for (const url of TARGET_URLS) {
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
    );

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // ===== 音源名（h1[data-e2e="music-title"]）取得 =====
    await page.waitForSelector(
      'h1[data-e2e="music-title"]',
      { timeout: 60000 }
    );
    
    await page.waitForFunction(() => {
      const el = document.querySelector('h1[data-e2e="music-title"]');
      return el && el.innerText && el.innerText.trim().length > 0;
    }, { timeout: 60000 });
    
    const musicTitle = await page.$eval(
      'h1[data-e2e="music-title"]',
      el => el.innerText.trim()
    );

    // ===== 動画数取得 =====
    await page.waitForSelector(
      'h2[data-e2e="music-video-count"]',
      { timeout: 60000 }
    );

    await page.waitForFunction(() => {
      const el = document.querySelector('h2[data-e2e="music-video-count"]');
      return el && el.innerText && el.innerText.trim().length > 0;
    }, { timeout: 60000 });

    const viewText = await page.$eval(
      'h2[data-e2e="music-video-count"]',
      el => el.innerText.trim()
    );

    console.log("取得:", musicTitle, viewText);

    await page.close();

    // ===== "750 videos" → 750 =====
    const parseVideoCount = text => {
      if (!text) return null;
      const match = text.match(/([\d,.]+)/);
      if (!match) return null;
      return Number(match[1].replace(/,/g, ""));
    };

    const videoCount = parseVideoCount(viewText);
    if (videoCount === null) {
      throw new Error("動画数の数値化に失敗: " + viewText);
    }

    // ===== Notion 保存 =====
    await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID,
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: musicTitle,
              },
            },
          ],
        },
        日付: {
          date: { start: new Date().toISOString() },
        },
        使用動画数: {
          number: videoCount,
        },
        URL: {
          url,
        },
      },
    });

    console.log("Notion保存完了:", musicTitle, videoCount);
  }

  await browser.close();
})();
