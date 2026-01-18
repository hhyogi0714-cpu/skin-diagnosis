const questions = [
    // --- Sagging (たるみ) ---
    {
        id: 1,
        category: 'sagging',
        axis: 'firmness', // ハリ・弾力
        text: "夕方になると、顔が疲れ気味で老けて見えることが多いですか？",
        options: [
            { text: "かなり感じる", score: 3 },
            { text: "少し感じる", score: 1 },
            { text: "あまり感じない", score: 0 }
        ]
    },
    {
        id: 2,
        category: 'sagging',
        axis: 'firmness', // ハリ・弾力
        text: "ほうれい線や口元のラインが以前より深く長くなった気がしますか？",
        options: [
            { text: "以前より深くなった", score: 3 },
            { text: "少し気になる", score: 1 },
            { text: "変わらない", score: 0 }
        ]
    },
    {
        id: 3,
        category: 'sagging',
        axis: 'firmness', // ハリ・弾力
        text: "フェイスラインがぼやけてきた、または二重顎が気になりますか？",
        options: [
            { text: "とても気になる", score: 3 },
            { text: "少し気になる", score: 1 },
            { text: "気にならない", score: 0 }
        ]
    },
    {
        id: 4,
        category: 'sagging',
        axis: 'moisture', // 潤い
        text: "頬の毛穴が縦に伸びて楕円形に見えますか？（たるみ毛穴）",
        options: [
            { text: "目立つ", score: 3 },
            { text: "よく見るとある", score: 1 },
            { text: "気にならない", score: 0 }
        ]
    },
    {
        id: 5,
        category: 'sagging',
        axis: 'glycation', // 糖化
        text: "朝起きた時の枕の跡が、なかなか消えないことがありますか？",
        options: [
            { text: "なかなか消えない", score: 3 },
            { text: "たまにある", score: 1 },
            { text: "すぐ消える", score: 0 }
        ]
    },
    // --- Spots (シミ・乾燥) ---
    {
        id: 6,
        category: 'spots',
        axis: 'lifestyle', // 生活習慣
        text: "日焼け止めは季節や天候に関わらず毎日塗っていますか？",
        options: [
            { text: "塗っていない日がある", score: 3 },
            { text: "夏だけ塗っている", score: 2 },
            { text: "毎日塗っている", score: 0 }
        ]
    },
    {
        id: 7,
        category: 'spots',
        axis: 'brightness', // 透明感
        text: "頬の高い位置などに、以前より濃くなったシミがありますか？",
        options: [
            { text: "濃くなった/増えた", score: 3 },
            { text: "少し気になる", score: 1 },
            { text: "特にない", score: 0 }
        ]
    },
    {
        id: 8,
        category: 'spots',
        axis: 'moisture', // 潤い
        text: "洗顔後、すぐに保湿しないと肌がつっぱったり乾燥を感じますか？",
        options: [
            { text: "強く感じる", score: 3 },
            { text: "少し感じる", score: 1 },
            { text: "感じない", score: 0 }
        ]
    },
    {
        id: 9,
        category: 'spots',
        axis: 'brightness', // 透明感
        text: "肌全体の透明感が減り、黄色っぽくくすんで見えることはありますか？",
        options: [
            { text: "よくある", score: 3 },
            { text: "たまにある", score: 1 },
            { text: "感じない", score: 0 }
        ]
    },
    {
        id: 10,
        category: 'spots',
        axis: 'moisture', // 潤い
        text: "季節の変わり目などに肌がかゆくなったり赤みが出やすいですか？",
        options: [
            { text: "頻繁にある", score: 3 },
            { text: "たまにある", score: 1 },
            { text: "ほとんどない", score: 0 }
        ]
    },
    // --- Lifestyle (生活・糖化) ---
    {
        id: 11,
        category: 'lifestyle',
        axis: 'glycation', // 糖化
        text: "甘いもの（お菓子、ジュース）や炭水化物（パン、麺類）が好きですか？",
        options: [
            { text: "大好きで毎日食べる", score: 3 },
            { text: "普通/時々食べる", score: 1 },
            { text: "あまり食べない", score: 0 }
        ]
    },
    {
        id: 12,
        category: 'lifestyle',
        axis: 'lifestyle', // 生活習慣
        text: "揚げ物やスナック菓子など、油っこい食事をよく摂りますか？",
        options: [
            { text: "よく摂る", score: 3 },
            { text: "週2-3回程度", score: 1 },
            { text: "控えている", score: 0 }
        ]
    },
    {
        id: 13,
        category: 'lifestyle',
        axis: 'lifestyle', // 生活習慣
        text: "平均的な睡眠時間は6時間未満ですか？",
        options: [
            { text: "6時間未満", score: 3 },
            { text: "6時間程度", score: 1 },
            { text: "7時間以上", score: 0 }
        ]
    },
    {
        id: 14,
        category: 'lifestyle',
        axis: 'lifestyle', // 生活習慣
        text: "運動をする習慣はありますか？（ウォーキングなど軽いもの含む）",
        options: [
            { text: "ほとんどしない", score: 3 },
            { text: "たまにする", score: 1 },
            { text: "定期的にしている", score: 0 }
        ]
    },
    {
        id: 15,
        category: 'lifestyle',
        axis: 'glycation', // 糖化
        text: "食事の際、早食いになってしまうことが多いですか？",
        options: [
            { text: "早食いだと思う", score: 3 },
            { text: "普通", score: 1 },
            { text: "ゆっくり噛んでいる", score: 0 }
        ]
    }
];

const advices = {
    // 1. ダイヤモンド肌 (All Good)
    diamond: {
        title: "💎 ダイヤモンド肌",
        message: "素晴らしい！5角形のバランスが整った理想的な状態です。今のケア習慣は間違っていません。",
        advice_physical: "<li><strong>現状維持がカギ</strong><br>無理に変える必要はありません。季節の変わり目だけ体調変化に気を配りましょう。</li>",
        advice_skincare: "<li><strong>ご褒美ケア</strong><br>週1回の高級マスクなど、心を満たすケアを取り入れてさらに輝きを。</li>",
        advice_food: "<li><strong>旬を味わう</strong><br>旬の食材は栄養価が高いです。今のバランスの良い食事を続けてください。</li>",
        advice_exosome: "今の美しさを「未来」へ繋ぐため、細胞の活性維持に使用します。定期的なメンテナンスとして取り入れることで、10年後も今の若々しさを保つことが期待できます。"
    },
    // 2. プレエイジング (Mild Risk)
    pre_aging: {
        title: "🛡️ プレエイジング・予防期",
        message: "大きなトラブルはありませんが、わずかに「ゆらぎ」のサインが見えます。今が未来の肌を決める分かれ道です。",
        advice_physical: "<li><strong>生活リズムの見直し</strong><br>週末の寝だめ等を控え、起床時間を一定に保つようにしましょう。</li>",
        advice_skincare: "<li><strong>エイジングケア導入</strong><br>「ナイアシンアミド」など、シワ改善と美白を同時に叶える多機能成分がおすすめです。</li>",
        advice_food: "<li><strong>抗酸化力の強化</strong><br>色の濃い野菜（トマト、ブロッコリー）を少し多めに意識してみてください。</li>",
        advice_exosome: "細胞の「司令塔」として働き、弱り始めた細胞に活力を与えます。加齢サインが定着する前に細胞レベルで予防線を張る、賢い先行投資となります。"
    },
    // 3. たるみ進行タイプ (Sagging High)
    sagging: {
        title: "⚠️ たるみ・ハリ低下 注意報",
        message: "肌の土台となるコラーゲン構造が緩み始めています。重力に負けない「引き上げケア」が急務です。",
        advice_physical: "<li><strong>頭皮ケア</strong><br>頭皮が1mm下がると顔は1cm下がると言われます。シャンプー時に頭皮を揉みほぐしましょう。</li>",
        advice_skincare: "<li><strong>レチノール・ペプチド</strong><br>コラーゲン産生を促す「レチノール」や、肌を支える「ペプチド」配合のクリームを。</li>",
        advice_food: "<li><strong>タンパク質チャージ</strong><br>毎食、手のひら1杯分のタンパク質（肉、魚、大豆）を欠かさずに。</li>",
        advice_exosome: "真皮にある「線維芽細胞」を直接刺激します。これによりコラーゲンやエラスチンの自発的な生成を強力に促し、緩んだ肌の土台を内側から再構築する効果が期待できます。"
    },
    // 4. シミ・紫外線タイプ (Spots/Brightness High)
    spots: {
        title: "☀️ シミ・紫外線ダメージ 注意報",
        message: "過去の紫外線ダメージが表面化し始めています。今あるシミを濃くしないケアと、未来のシミ予防が必要です。",
        advice_physical: "<li><strong>徹底UVブロック</strong><br>ゴミ出しや洗濯干しの短い時間でも対策を。飲む日焼け止めの併用も検討を。</li>",
        advice_skincare: "<li><strong>美白美容液の投入</strong><br>「トラネキサム酸」「コウジ酸」など、メラニン生成プロセスの初期段階を抑える成分を。</li>",
        advice_food: "<li><strong>ビタミンA・C・E</strong><br>「ビタミンACE（エース）」を意識。カボチャやナッツ類がおすすめです。</li>",
        advice_exosome: "乱れたターンオーバー（肌の生まれ変わり）を正常化し、蓄積したメラニンの排出を促します。同時に、強力な抗炎症作用により、紫外線ダメージによる微弱炎症を鎮静化させます。"
    },
    // 5. 乾燥・バリア低下 (Moisture High)
    dryness: {
        title: "🌵 乾燥・バリア機能低下 注意報",
        message: "肌の水分保持力が低下し、外部刺激を受けやすくなっています。全ての老化の原因「乾燥」を食い止めましょう。",
        advice_physical: "<li><strong>入浴温度の調整</strong><br>熱すぎるお湯はNG。38〜40度のぬるま湯で、皮脂の洗い流しすぎを防ぎましょう。</li>",
        advice_skincare: "<li><strong>ヒト型セラミド</strong><br>最強の保湿成分「セラミド」配合の化粧水・クリームで、バリア機能を再構築します。</li>",
        advice_food: "<li><strong>良質な油</strong><br>亜麻仁油やえごま油など、オメガ3脂肪酸をサラダにかけて内側から潤いを。</li>",
        advice_exosome: "細胞間脂質（セラミドなど）の合成をサポートし、自ら潤う力を取り戻させます。薄くなった角層バリアを修復し、水分を抱え込める健康な肌質への改善を目指します。"
    },
    // 6. 糖化・黄ぐすみ (Glycation High)
    glycation: {
        title: "🥞 糖化（焦げ付き） 注意報",
        message: "余分な糖がタンパク質と結びつく「糖化」により、肌の弾力低下や黄ぐすみが起きています。",
        advice_physical: "<li><strong>ベジファースト</strong><br>食事は必ず野菜から。血糖値の急上昇（糖化トリガー）を防ぐ最も有効な手段です。</li>",
        advice_skincare: "<li><strong>抗糖化ケア</strong><br>「カルノシン」「ウメ果実エキス」など、黄ぐすみに特化した成分配合のコスメを。</li>",
        advice_food: "<li><strong>GI値を意識</strong><br>白米より玄米、食パンより全粒粉パンなど、低GI食品を選びましょう。</li>",
        advice_exosome: "血管新生や血流改善を促すことで、黄ぐすみの原因となる老廃物の排出をサポートします。また、タンパク質の変性を抑え、透明感のあるクリアな肌印象を取り戻します。"
    },
    // 7. たるみ×シミ (Composite)
    sagging_spots: {
        title: "⚠️⚠️ 老化スパイラル（たるみ×シミ）",
        message: "紫外線などのダメージにより、コラーゲン破壊（たるみ）とメラニン過剰（シミ）が同時に進行しています。",
        advice_physical: "<li><strong>光老化対策</strong><br>老化原因の8割は光老化です。日傘や帽子も活用し、物理的に紫外線を遮断してください。</li>",
        advice_skincare: "<li><strong>ビタミンC誘導体</strong><br>美白とコラーゲン生成の両方に働くビタミンCが高濃度で配合された美容液がベストです。</li>",
        advice_food: "<li><strong>抗酸化リッチ</strong><br>アスタキサンチン（鮭）やリコピン（トマト）など、強力な抗酸化成分でダメージをリセット。</li>",
        advice_exosome: "線維芽細胞の活性化による「ハリ弾力再生」と、ターンオーバー促進による「シミ排出」のダブルアプローチが可能です。複合的な老化サインを一網打尽にする、最も効率的な手段と言えます。"
    },
    // 8. たるみ×糖化 (Composite)
    sagging_glycation: {
        title: "🍰 肌の焦げ付き・たるみ 注意報",
        message: "糖化によって固くなったコラーゲンが、肌のハリを失わせています。弾力がなく、ごわつきを感じやすい状態です。",
        advice_physical: "<li><strong>食後のウォーキング</strong><br>食べてすぐ寝るのは厳禁。食後15分の軽い運動で、糖をエネルギーとして消費しましょう。</li>",
        advice_skincare: "<li><strong>角質ケア＋導入美容液</strong><br>ごわついた肌をピーリングで解きほぐし、美容成分が届きやすい土台を作ります。</li>",
        advice_food: "<li><strong>お茶のカテキン</strong><br>緑茶やカモミールティーには抗糖化作用があります。甘いジュースの代わりに習慣化を。</li>",
        advice_exosome: "固く変性したコラーゲン繊維がある環境下で、新しい良質なコラーゲンの生成を強力に指示します。ごわついた肌を内側からふっくらと柔らかい状態へ導きます。"
    },
    // 9. シミ×糖化 (Composite)
    spots_glycation: {
        title: "🍂 くすみ・濁り肌 注意報",
        message: "メラニンの茶色と、糖化の黄色が混ざり、顔全体のトーンが暗く濁って見えやすい状態です。",
        advice_physical: "<li><strong>睡眠の質向上</strong><br>成長ホルモンによる肌修復が追いついていません。就寝環境（暗さ、温度）を見直しましょう。</li>",
        advice_skincare: "<li><strong>ブライトニング全般</strong><br>面での美白ケアが必要です。シートマスクを多用し、水分で満たして透明感を出しましょう。</li>",
        advice_food: "<li><strong>ネバネバ食品</strong><br>オクラ、納豆、海藻などの水溶性食物繊維は、糖質の吸収を穏やかにし、腸内環境も整えます。</li>",
        advice_exosome: "代謝機能が低下した細胞に「若返りシグナル」を送ることで、停滞したターンオーバーを強制的に動かします。メラニンと糖化生成物（AGEs）の排出を同時に加速させます。"
    },
    // 10. 全体的に悪い (Crisis)
    crisis: {
        title: "🚑 エイジングクライシス",
        message: "複数の老化サインが重なり合っています。今すぐに生活習慣とスキンケアを根本から見直す必要があります。",
        advice_physical: "<li><strong>休息とリセット</strong><br>まずは体を休めること。ストレス過多や睡眠不足が全ての不調の源です。</li>",
        advice_skincare: "<li><strong>基本の徹底</strong><br>高価なクリームの前に、洗顔温度や摩擦レスを見直してください。基本の保湿（セラミド）から立て直しましょう。</li>",
        advice_food: "<li><strong>和食中心</strong><br>「まごわやさしい」を合言葉に、バランスの取れた和定食スタイルに戻しましょう。</li>",
        advice_exosome: "疲弊しきった細胞を数多く修復・再生させる必要があります。エクソソーム導入は、自力での回復が難しくなった肌にとって、最強の「救世主」となり得ます。"
    }
};
