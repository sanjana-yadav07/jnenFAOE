"use client";
import Link from "next/link";
import { ArrowLeft, Check, Moon, Play, Volume2, VolumeX } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import InterventionFeedback from "@/components/InterventionFeedback";
import { aiService } from "@/services/ai";
import { getRelaxContentForCaseType, RelaxLanguage } from "@/lib/RelaxContent";
import { useSpeech } from "@/lib/useSpeech";

import { useAppStore } from "@/store/useAppStore";
import { LanguageDropdown } from "@/components/LanguageDropdown";

const PROMPT_INTERVAL_SECONDS = 40;

export default function RelaxPage() {
	const globalLang = useAppStore((state) => state.language);
	const currentCase = useAppStore((state) => state.currentCase);
	const [started, setStarted] = useState(false);
	const [done, setDone] = useState(false);
	const [timeLeft, setTimeLeft] = useState(300);
	const [caseType, setCaseType] = useState<string | null>(currentCase?.caseCategory ?? null);
	const [promptIndex, setPromptIndex] = useState(0);
	const [language, setLanguage] = useState<RelaxLanguage>(globalLang === "Hindi" ? "hi" : "en");
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		setLanguage(globalLang === "Hindi" ? "hi" : "en");
	}, [globalLang]);

	const content = getRelaxContentForCaseType(caseType);
	const prompts = content.prompts[language];
	const currentPrompt = prompts[promptIndex] || prompts[0];

	const { speak, stop, speaking, enabled, toggleEnabled, setGender, gender } = useSpeech();

	useEffect(() => {
		if (!started || done) return;
		speak(currentPrompt, language);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [promptIndex, started, done, language]);

	useEffect(() => {
		if (!started || done) return;
		timerRef.current = setInterval(() => {
			setTimeLeft((t) => {
				if (t <= 1) {
					clearInterval(timerRef.current!);
					setDone(true);
					stop();
					return 0;
				}
				return t - 1;
			});
		}, 1000);
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [started, done]);

	useEffect(() => {
		if (!started || done) return;
		const pInterval = setInterval(() => {
			setPromptIndex((i) => (i + 1) % prompts.length);
		}, PROMPT_INTERVAL_SECONDS * 1000);
		return () => clearInterval(pInterval);
	}, [started, done, prompts.length]);

	useEffect(() => {
		return () => stop();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const formatTime = (s: number) => {
		const m = Math.floor(s / 60);
		const sec = s % 60;
		return `${m}:${sec.toString().padStart(2, "0")}`;
	};

	const startRelaxation = () => {
		setStarted(true);
	};

	return (
		<div className="px-5 pb-10 md:px-10 xl:px-14">
			<Link href="/survivor/feel-better" className="inline-flex items-center gap-2 text-sm font-semibold text-[#75857f]">
				<ArrowLeft size={16} /> {language === "hi" ? "बेहतर महसूस करें" : "Feel better"}
			</Link>

			<div className="mx-auto mt-10 max-w-2xl text-center">
				<span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#efeaf5] text-[#8064a2]">
					<Moon size={27} />
				</span>
				<p className="mt-6 text-xs font-bold uppercase tracking-[.2em] text-[#7e918b]">{content.title[language]} · {language === "hi" ? "5 मिनट" : "5 min"}</p>
				<h1 className="mt-3 font-display text-5xl text-[#172326]">
					{language === "hi" ? "दिन के तनाव को हल्का होने दें।" : "Let the day soften."}
				</h1>
				<p className="mt-4 text-lg text-[#63736e]">
					{language === "hi"
						? "एक शांत गतिविधि जो आपके कंधों के तनाव को कम करने और ध्यान को स्थिर करने में मदद करे।"
						: "A slow, quiet activity to help your shoulders drop and your attention settle."}
				</p>

				{!started && (
					<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
						<LanguageDropdown variant="pill" />

						<div className="inline-flex rounded-full border border-[#d8cfe8] p-1">
							<button
								onClick={() => setGender("female")}
								className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${gender === "female" ? "bg-[#8064a2] text-white" : "text-[#8064a2]"}`}
							>
								{language === "hi" ? "स्त्री स्वर" : "Female voice"}
							</button>
							<button
								onClick={() => setGender("male")}
								className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${gender === "male" ? "bg-[#8064a2] text-white" : "text-[#8064a2]"}`}
							>
								{language === "hi" ? "पुरुष स्वर" : "Male voice"}
							</button>
						</div>
					</div>
				)}

				<div className="surface-soft mt-10 rounded-[28px] p-8">
					<div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#e8e0f3] text-3xl text-[#8064a2]">{done ? <Check /> : formatTime(timeLeft)}</div>

					{started && !done && (
						<p className="mt-6 min-h-12 text-base font-medium text-[#3f4f4a] transition-opacity duration-500">
							{currentPrompt}
						</p>
					)}
					{!started && (
						<p className="mt-6 text-sm text-[#6b7b75]">
							{language === "hi" ? "विश्राम करने के लिए एक पल निकालें।" : "Take a moment to relax."}
						</p>
					)}
					{done && <p className="mt-6 text-sm text-[#6b7b75]">You made space for yourself.</p>}

					<div className="mt-8 flex items-center justify-center gap-3">
						{!started ? (
							<button
								onClick={startRelaxation}
								className="flex items-center gap-2 rounded-full bg-[#8064a2] px-7 py-3 text-sm font-bold text-white shadow-sm"
							>
								<Play size={16} /> {language === "hi" ? "शुरू करें" : "Begin"}
							</button>
						) : (
							<button
								onClick={toggleEnabled}
								className="flex items-center gap-2 rounded-full bg-[#e8e0f3] px-6 py-3 text-sm font-bold text-[#8064a2]"
							>
								{enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
								{enabled ? (language === "hi" ? "आवाज़ मार्गदर्शन चालू" : "Voice on") : (language === "hi" ? "आवाज़ बंद" : "Voice off")}
							</button>
						)}
					</div>

					{started && !done && speaking && (
						<p className="mt-3 text-xs text-[#9a8bb0]">Speaking…</p>
					)}
				</div>

				{done && <InterventionFeedback activity="relax" />}
			</div>
		</div>
	);
}