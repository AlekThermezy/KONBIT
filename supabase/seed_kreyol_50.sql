-- =====================================================
-- KREYÒL DICTIONARY — Day 1 Batch (50 Words)
-- =====================================================
-- Add these to dictionary_words table
-- Day 1 = foundation vocabulary (greetings, essentials)
-- =====================================================

BEGIN;

INSERT INTO public.dictionary_words 
(word, word_creole, pronunciation, translation_english, translation_french, translation_spanish, part_of_speech, gender, example_sentence, example_translation, category, difficulty, tags, day_added)
VALUES
-- Greetings
('Hello', 'Bonswa', 'bon-swa', 'Hello / Good day', 'Bonjour', 'Hola', 'interjection', 'mf', 'Bonswa! Ki jan w ye?', 'Hello! How are you?', 'greetings', 'beginner', ARRAY['essential','daily'], 1),
('Good morning', 'Bonswa', 'bon-swa', 'Good morning / Good day', 'Bonjour', 'Buenos días', 'interjection', 'mf', 'Bonswa! Laploitays la ap travay?', 'Good morning! How was your night?', 'greetings', 'beginner', ARRAY['essential','morning'], 1),
('Good evening', 'Bonswa', 'bon-swa', 'Good evening', 'Bonsoir', 'Buenas tardes', 'interjection', 'mf', 'Bonswa! Jodia tout lajounen te difisil.', 'Good evening! Today was a difficult day.', 'greetings', 'beginner', ARRAY['essential','evening'], 1),
('Goodbye', 'Orevwa', 'o-re-vwa', 'Goodbye', 'Au revoir', 'Adiós', 'interjection', 'mf', 'Orevwa! Pral rankontre w demen.', 'Goodbye! See you tomorrow.', 'greetings', 'beginner', ARRAY['essential'], 1),
('See you later', 'Anplis', 'an-plis', 'See you later / Plus tard', 'À plus tard', 'Hasta luego', 'interjection', 'mf', 'Anplis! Tanpri sonje mwen.', 'See you later! Please remember me.', 'greetings', 'beginner', ARRAY['essential'], 1),
('Yes', 'Wi', 'wi', 'Yes', 'Oui', 'Sí', 'interjection', 'mf', 'Wi, mwen konprann.', 'Yes, I understand.', 'greetings', 'beginner', ARRAY['essential'], 1),
('No', 'Non', 'non', 'No', 'Non', 'No', 'interjection', 'mf', 'Non, mwen pa kapab.', 'No, I cannot.', 'greetings', 'beginner', ARRAY['essential'], 1),
('Please', 'Tanpri', 'tan-pri', 'Please', 'S''il vous plaît', 'Por favor', 'interjection', 'mf', 'Tanpri, ede mwen.', 'Please, help me.', 'greetings', 'beginner', ARRAY['essential','polite'], 1),
('Thank you', 'Mesi', 'me-si', 'Thank you', 'Merci', 'Gracias', 'interjection', 'mf', 'Mesi anpil pou edikasyon sa.', 'Thank you very much for this education.', 'greetings', 'beginner', ARRAY['essential','polite'], 1),
('Excuse me', 'Eskize m', 'es-ki-zez me', 'Excuse me / Sorry', 'Excusez-moi', 'Disculpe', 'interjection', 'mf', 'Eskize m, mwen bezwen ale.', 'Excuse me, I need to go.', 'greetings', 'beginner', ARRAY['polite'], 1),

-- Everyday
('Water', 'Dlo', 'dlo', 'Water', 'Eau', 'Agua', 'noun', 'm', 'Mwen bezwen dlo.', 'I need water.', 'everyday', 'beginner', ARRAY['essential','survival'], 1),
('Food', 'Manje', 'man-je', 'Food / Meal', 'Nourriture', 'Comida', 'noun', 'm', 'Manje a byen gat.', 'The food is delicious.', 'everyday', 'beginner', ARRAY['essential'], 1),
('Money', 'Lajan', 'la-zhan', 'Money', 'Argent', 'Dinero', 'noun', 'm', 'Lajan an pap sufí.', 'The money will not be enough.', 'everyday', 'beginner', ARRAY['essential','business'], 1),
('House', 'Kay', 'kai', 'House / Home', 'Maison', 'Casa', 'noun', 'm', 'Kay la pito.', 'The house is far.', 'everyday', 'beginner', ARRAY['essential'], 1),
('Work', 'Travay', 'tra-vai', 'Work / Job', 'Travail', 'Trabajo', 'noun', 'm', 'Travay la difisil, men mwen ap fè l.', 'The work is difficult, but I am doing it.', 'everyday', 'beginner', ARRAY['essential','business'], 1),
('Time', 'Tan', 'tan', 'Time', 'Temps', 'Tiempo', 'noun', 'm', 'Tan ap rule.', 'Time is passing.', 'everyday', 'beginner', ARRAY['essential','time'], 1),
('Day', 'Jou', 'zou', 'Day', 'Jour', 'Día', 'noun', 'm', 'Jou a te long.', 'The day was long.', 'time', 'beginner', ARRAY['essential'], 1),
('Night', 'Nwit', 'nwit', 'Night', 'Nuit', 'Noche', 'noun', 'm', 'Nwit la fèk komanse.', 'The night just started.', 'time', 'beginner', ARRAY['essential'], 1),
('Person', 'Moun', 'moun', 'Person', 'Personne', 'Persona', 'noun', 'm', 'Moun nan la byen.', 'The person is good.', 'everyday', 'beginner', ARRAY['essential'], 1),
('Man', 'Gason', 'ga-zon', 'Man / Boy', 'Homme / Garçon', 'Hombre / Chico', 'noun', 'm', 'Gason nan ap travay la tè.', 'The man is working the land.', 'family', 'beginner', ARRAY['essential'], 1),
('Woman', 'Fanm', 'fanm', 'Woman', 'Femme', 'Mujer', 'noun', 'f', 'Fanm nan ap fè manje.', 'The woman is cooking.', 'family', 'beginner', ARRAY['essential'], 1),
('Child', 'Timoun', 'ti-moun', 'Child', 'Enfant', 'Niño', 'noun', 'm', 'Timoun nan renmen jwe.', 'The child likes to play.', 'family', 'beginner', ARRAY['essential'], 1),
('Friend', 'zanmi', 'zan-mi', 'Friend', 'Ami', 'Amigo', 'noun', 'mf', 'Zanmi mwen se yon bon moun.', 'My friend is a good person.', 'everyday', 'beginner', ARRAY['social'], 1),
('People', 'Nèf', 'nef', 'People', 'gens / Peuple', 'Gente', 'noun', 'm', 'Nèf yo se nou.', 'The people, we are them.', 'everyday', 'beginner', ARRAY['essential'], 1),

-- Food
('Bread', 'Pen', 'pen', 'Bread', 'Pain', 'Pan', 'noun', 'm', 'Pen an fres.', 'The bread is fresh.', 'food', 'beginner', ARRAY['food'], 1),
('Rice', 'Diri', 'di-ri', 'Rice', 'Riz', 'Arroz', 'noun', 'm', 'Diri a byen kwit.', 'The rice is well cooked.', 'food', 'beginner', ARRAY['food','staple'], 1),
('Bean', 'Pwa', 'pwa', 'Bean / Peas', 'Haricot', 'Frijol', 'noun', 'm', 'Pwa nan fè byen.', 'The beans are good.', 'food', 'beginner', ARRAY['food','staple'], 1),
('Chicken', 'Poulet', 'poo-le', 'Chicken', 'Poulet', 'Pollo', 'noun', 'm', 'Poulet la bèl.', 'The chicken is beautiful.', 'food', 'beginner', ARRAY['food','meat'], 1),
('Fish', 'Pwason', 'pwa-son', 'Fish', 'Poisson', 'Pescado', 'noun', 'm', 'Pwason an frèch.', 'The fish is fresh.', 'food', 'beginner', ARRAY['food','meat'], 1),
('Salt', 'Sèl', 'sel', 'Salt', 'Sel', 'Sal', 'noun', 'm', 'Sèl la pa ase.', 'The salt is not enough.', 'food', 'beginner', ARRAY['food'], 1),
('Sugar', 'Sik', 'sik', 'Sugar', 'Sucre', 'Azúcar', 'noun', 'm', 'Sik la anpil.', 'There is a lot of sugar.', 'food', 'beginner', ARRAY['food'], 1),
('Coffee', 'Kafe', 'ka-fe', 'Coffee', 'Café', 'Café', 'noun', 'm', 'Kafe a cho.', 'The coffee is hot.', 'food', 'beginner', ARRAY['food','drink'], 1),

-- Business / Work
('Buy', 'Achte', 'a-sh-te', 'Buy / Purchase', 'Acheter', 'Comprar', 'verb', 'mf', 'Mwen achte l nan magazen an.', 'I bought it at the store.', 'business', 'beginner', ARRAY['essential','commerce'], 1),
('Sell', 'Vann', 'van', 'Sell', 'Vendre', 'Vender', 'verb', 'mf', 'Yo vann pen nan lari a.', 'They sell bread on the street.', 'business', 'beginner', ARRAY['essential','commerce'], 1),
('Price', 'Pri', 'pri', 'Price', 'Prix', 'Precio', 'noun', 'm', 'Pri an te wo.', 'The price was high.', 'business', 'beginner', ARRAY['essential','commerce'], 1),
('Pay', 'Peye', 'pe-ye', 'Pay', 'Payer', 'Pagar', 'verb', 'mf', 'Mwen peye la.', 'I paid there.', 'business', 'beginner', ARRAY['essential'], 1),
('Market', 'Mache', 'ma-she', 'Market', 'Marché', 'Mercado', 'noun', 'm', 'Mache a plen moun.', 'The market is full of people.', 'business', 'beginner', ARRAY['essential'], 1),
('Store', 'Boutik', 'boo-tik', 'Store / Shop', 'Boutique', 'Tienda', 'noun', 'm', 'Boutik la pi ra.', 'The store is expensive.', 'business', 'beginner', ARRAY['commerce'], 1),
('Work', 'Travay', 'tra-vai', 'To work', 'Travailler', 'Trabajar', 'verb', 'mf', 'Mwen travay anpil.', 'I work a lot.', 'business', 'beginner', ARRAY['essential'], 1),
('Business', 'Biznis', 'biz-nis', 'Business', 'Business', 'Negocio', 'noun', 'm', 'Biznis la ap ale byen.', 'The business is going well.', 'business', 'beginner', ARRAY['essential'], 1),

-- Numbers (basic)
('One', 'Yon', 'yon', 'One', 'Un', 'Uno', 'adj', 'mf', 'Yon moun.', 'One person.', 'numbers', 'beginner', ARRAY['essential'], 1),
('Two', 'De', 'de', 'Two', 'Deux', 'Dos', 'adj', 'mf', 'De moun.', 'Two people.', 'numbers', 'beginner', ARRAY['essential'], 1),
('Three', 'Twa', 'twa', 'Three', 'Trois', 'Tres', 'adj', 'mf', 'Twa tas dlo.', 'Three glasses of water.', 'numbers', 'beginner', ARRAY['essential'], 1),
('Four', 'Kat', 'kat', 'Four', 'Quatre', 'Cuatro', 'adj', 'mf', 'Kat bwat lison.', 'Four boxes of lotion.', 'numbers', 'beginner', ARRAY['essential'], 1),
('Five', 'Senk', 'senk', 'Five', 'Cinq', 'Cinco', 'adj', 'mf', 'Senk pyès bwos.', 'Five pieces of brush.', 'numbers', 'beginner', ARRAY['essential'], 1),
('Ten', 'Dis', 'dis', 'Ten', 'Dix', 'Diez', 'adj', 'mf', 'Dis dola.', 'Ten dollars.', 'numbers', 'beginner', ARRAY['essential'], 1),
('Twenty', 'Venn', 'ven', 'Twenty', 'Vingt', 'Veinte', 'adj', 'mf', 'Venn lajan.', 'Twenty pieces of money.', 'numbers', 'beginner', ARRAY['intermediate'], 1),
('Hundred', 'San', 'san', 'Hundred', 'Cent', 'Cien', 'adj', 'mf', 'San moun.', 'A hundred people.', 'numbers', 'beginner', ARRAY['essential'], 1),

-- Questions
('What', 'Kisa', 'ki-sa', 'What', 'Qu''est-ce que', 'Qué', 'pronoun', 'mf', 'Kisa w ap fè la?', 'What are you doing there?', 'questions', 'beginner', ARRAY['essential'], 1),
('Where', 'Kote', 'ko-te', 'Where', 'Où', 'Dónde', 'pronoun', 'mf', 'Kote ou ye?', 'Where are you?', 'questions', 'beginner', ARRAY['essential'], 1),
('When', 'Lè', 'le', 'When', 'Quand', 'Cuándo', 'pronoun', 'mf', 'Lè ou pral vini?', 'When are you coming?', 'questions', 'beginner', ARRAY['essential'], 1),
('Who', 'Ki moun', 'ki moun', 'Who', 'Qui', 'Quién', 'pronoun', 'mf', 'Ki moun ki fè sa?', 'Who did this?', 'questions', 'beginner', ARRAY['essential'], 1),
('How', 'Kijan', 'ki-zhan', 'How', 'Comment', 'Cómo', 'pronoun', 'mf', 'Kijan w ye?', 'How are you? (literally: How are you?)', 'questions', 'beginner', ARRAY['essential'], 1),
('Why', 'Poukisa', 'poo-ki-sa', 'Why', 'Pourquoi', 'Por qué', 'pronoun', 'mf', 'Poukisa ou ap plenn?', 'Why are you crying?', 'questions', 'beginner', ARRAY['essential'], 1);

-- Seed more everyday + common verbs
INSERT INTO public.dictionary_words 
(word, word_creole, pronunciation, translation_english, translation_french, part_of_speech, example_sentence, example_translation, category, difficulty, tags, day_added)
VALUES
-- Verbs
('Go', 'Ale', 'a-le', 'Go', 'Aller', 'verb', 'Mwen ale nan mache a.', 'I am going to the market.', 'everyday', 'beginner', ARRAY['essential'], 1),
('Come', 'Vini', 'vi-ni', 'Come', 'Venir', 'verb', 'Vini la, mwen ye w.', 'Come here, I am waiting for you.', 'everyday', 'beginner', ARRAY['essential'], 1),
('Eat', 'Manje', 'man-je', 'Eat', 'Manger', 'verb', 'Mwen manje dlo ak pen.', 'I eat bread and water.', 'everyday', 'beginner', ARRAY['essential'], 1),
('Drink', 'Bwe', 'bwe', 'Drink', 'Boire', 'verb', 'Mwen bwe dlo.', 'I drink water.', 'everyday', 'beginner', ARRAY['essential'], 1),
('Speak', 'Pale', 'pa-le', 'Speak / Talk', 'Parler', 'verb', 'Mwen pale kreyòl.', 'I speak Creole.', 'everyday', 'beginner', ARRAY['essential'], 1),
('Understand', 'Konprann', 'kon-pran', 'Understand', 'Comprendre', 'verb', 'Mwen konprann ou.', 'I understand you.', 'everyday', 'beginner', ARRAY['essential'], 1),
('Know', 'Konnen', 'ko-nen', 'Know', 'Savoir', 'verb', 'Mwen kennen sa.', 'I know that.', 'everyday', 'beginner', ARRAY['essential'], 1),
('Want', 'Vle', 'vle', 'Want / Wish', 'Vouloir', 'verb', 'Mwen vle ale.', 'I want to go.', 'everyday', 'beginner', ARRAY['essential'], 1),
('Can', 'Kapab', 'ka-pab', 'Can / Be able', 'Pouvoir', 'verb', 'Mwen kapab fè sa.', 'I can do that.', 'everyday', 'beginner', ARRAY['essential'], 1),
('See', 'Wè', 'we', 'See', 'Voir', 'verb', 'Mwen wè w.', 'I see you.', 'everyday', 'beginner', ARRAY['essential'], 1),
('Give', 'Bay', 'bai', 'Give', 'Donner', 'verb', 'Tanpri bay mwen lajan.', 'Please give me money.', 'everyday', 'beginner', ARRAY['essential'], 1),
('Take', 'Pran', 'pran', 'Take', 'Prendre', 'verb', 'Pran sa a.', 'Take this one.', 'everyday', 'beginner', ARRAY['essential'], 1),
('Say', 'Di', 'di', 'Say', 'Dire', 'verb', 'Di mwen la verite.', 'Tell me the truth.', 'everyday', 'beginner', ARRAY['essential'], 1),
('Think', 'Panse', 'pan-se', 'Think', 'Penser', 'verb', 'Mwen panse sa se vre.', 'I think that is true.', 'everyday', 'beginner', ARRAY['intermediate'], 1),
('Help', 'Ede', 'e-de', 'Help', 'Aider', 'verb', 'Ede mwen ak travay la.', 'Help me with the work.', 'everyday', 'beginner', ARRAY['essential','social'], 1);

COMMIT;

-- Verify:
-- SELECT count(*) FROM public.dictionary_words;