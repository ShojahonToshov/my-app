"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Phone, User as UserIcon, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/hooks/useI18n";
import { AdaptedLogo } from "@/components/AdaptedLogo";
import { Outfit } from "next/font/google";

const customFont = Outfit({ 
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

import { Suspense } from "react";

const smoothEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

function DesignSignupContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "customer";
  
  const [showPassword, setShowPassword] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const isBusiness = role === "business";
  const title = isBusiness ? "Create Business Account" : "Create Customer Account";
  const subtitle = isBusiness 
    ? "Join Elara to manage your business" 
    : "Join Elara to book premium services";

  return (
    <div className={`h-full w-full bg-[#D8DADC] text-[#0B0C0D] selection:bg-[#151719] selection:text-white flex items-center justify-center py-6 px-4 relative overflow-hidden ${customFont.className}`}>
      
      {/* GLOBAL NOISE */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.02]"
        style={{ backgroundImage: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAAAAADmVT4XAABAkElEQVR4nAAJQPa/AD0MkuwhibnkH8Ts0Yay35DwRoBzOV12nnTrcUGGbMmdCUi3NQjZJd5NhwMfbQxhvfCmb9zcesIxYpQwMsByLYWLpeIZrewegOTy2Uzxe/tW9CYfbkW/88b2Pr3PsRhrehEijAqx/tG0dSrK/cakzArBGJGtxAbArfsj5E4bma33AMiL6D1+/1qGk/lp2eNgE/SLOnABL2SKGVkC5FZQjW/To6u5bB2pzJnMqgqLpNdld/Ed6wuOKj/kzqjMwou/dTfYFZbJn6HCnYP4tRWiez54f/fYacUvGeGp8DcWA9Z1BSJBPE04p0ATz0i851Kcy7h/KWWR4DZrOvfHMSdNfb1RAAEpixJCJo1DjMVzHBCI4hVPPTYLyaOqN1vr0UnxKUiUUd4r7Ot45OqUQM7yhrcBUU1F4ehw4cWNnsW4YRlyrzmBi/1biqXlzYhRBfFxg1cv2ooM7kl0Dt1CkHb5EtfUH0ceTSjUuJWMng+3Hm7sYYBXSsPouBXwWeO4RjYAKmFWAJu3c+Rij30Y64+omneggkHsUljWwQP007b0kvezhCG2RshATwx6xxdJW8qWhHiHmspOj+Jr8ZDBi6c6TFGyOeBwFdEh19G+tnfkzkDRGN37Npv2iQGYcWbtHThnl5rrobIwSJz7jfq9a7HFNSMlHBzwSekTApXt90dhqPVBIjsKAIANFpShEf+YOw6YAAfBSPR5G7nhPJSFRgE2QkH/gv4JM/w/ZuVeNlvKayEaWm0MjniueP3Ah2UrYd3uYtB09z3MqEFK510iPsxrixwkrZl5MTwsgdFQ4mRPIVlx5zWRg9+6k87cGNP37TgaXSheJtJVjRBoqwYm6HEyDMrT8kEqAAEkJLkaUxzRvHTOy+OVIAvqZ9xP21EbCIN3Kbll1j8nBmZ/XL7rCXUkl/OrYG2yCdgdKaVGH+i396ga9RhoUTtwXJVLvLN7vzOTKWN2IBc3xI4x6G0O3405xHHQI7TEAPcx8AeEXbuL7DA6lKmc9rBDvw+fpZLuvPYCwSUfBpFyAChUyMjSwQvxF0b4p4MO7x5VBbk1d0WLJUzcY0y2RlW2dR0Po5SMHrHpM2JngO7GoBZQu0kEc7iGTHpe/Ge7JcIR+bpFaofLqxzJB0DRhg3sHvlPlZCq4KHQ3FgYc9JxagESrHtUPE/aYEvtxHhO0df/T57HgMwWiie9EyY8sLHeAPIM8PL0LGg2sRY0xq/SyVjVQ6/9K+ME0DhhVZJMmSfss9mu7qMKHXGvqBfo7624v/+loL+zpTgOGHbfaW4BfZFp7z6edInnZksnfxzpkMKBMYtFDRCL+CmKDRnle0JBNJKVlAe5j/2Ahc7sH9Eo8L61vk3tykajQdwKLBg8UaJkABEOPkccYZW4NFaRto82n8sLjmKXZFxz6JycgMLSW8k/jRgrCk9Cyn+n7ZcwcQkI/ID6dI3pcis3J9s3BxmXV5+bhiu3f3fhFZXEWDWIe+K/pWdt+8nu1XPsFi/zN6TaDml0CYOJLzFo5GKY8qe8UkKjvVA0fMpFgqEBD3RTCK6gAASg/HcKUe7/guTuWaRezlRa2NjWOwt7p2UPT3/IQLDyVwV8rnXM5wcMtRFcgbOd1P/Dnyak3mPKZxpZEuQxsrbIziOJufNQPwzl+mtmUdSoPM8F+P6Fg0garo8rmqcoF2qReRVJ/G8sH9dTV6FUf5jAXuGoc8LpcVHkSWKPI8Q+APh63X/xSTT2sNDHa1pxRDDloiHXerkXbIBKjOpKpzZaIvzT6LwvOqHXBX6Yv8c0M8wIU+R/SabxOsoqQpyfgu5+2n9oVWvg8dxHJyiPXlGyq/0H12DO8wd9Fp3lXX7hf8vXeTBoucrDsWzB/NaIC9vHu7pW0/mMQA2GI6I4YesUAL5oeom17n6bqnXVHrcbwFWwNgiW0mPUaDqFs+ECxNAatlkA3WO+pO7y0RsNa5UDvb6ePj3ksHQyvnfKR6KIeEco599Plf6kafkB7w9N4aCziT6AsmP+kC9dV8FxfVGAfQ3dw7w4dY0Lha+ZqvzjalEwA0X4HQ9b44XrUtf1V1ChAARYktFobVAufKLDrr0HB3rhWf3J1qDmvQxP1ILwLj9ZaD61ukRM5mjDne/LrN4GkW+ri8wEanWZLYkjElwuk0Pi5kcEwUDk/OPTu2e1X/vx6K+AyCDs0QzdKXy+exxmBNmW6M3BOd5yEiisdXXc0fDMXqfvraRQCRwPSnRJQ1k+ANi0OoY98NRI1Ycn8lgCP/msHVbu9TfWp7mNjcWZS2X0yawgEUOmJ5t8wJ2hbxCL9bcy2ZBxKpj9wiHna7QDpWvuwTj6ewZ0PnA+FoVopwUzJQmetRFDVqeeFRgCk/wfM9nYGZgCy/96CmMWgxWhUz6NKXMq5wdug7FlJ2c6gL+DALhjakftWzZG1O7QvHqkawO5nqY6Dji9PBZRYCg6xS3wuBVPMKBtWQjU3lguhIZ8KHuha2s+kwVbGG0KopGGm+SA3TUawSnkE+XyY5osRhTmp7ji6mK808U1mX5KMWbWFQid3grgCHF21Eh3HrIia3iYIlSyI9DHkmJnnBX7NP+wAMpXAzPnpNpoNC26wpJe03E1YAUrPnjnIJFPe6DTI6gQZYXnBoKvvdqdIm9ZQcP09VR1x9bhRJ0A0q25c4Ik01j0hFjj6TpWZP0zfhX6YnatbPr2fuwLvNliPy1JijRBb+msIkRgJE0qtDbCJVP7wwORBr5ItTrDl/tFpFKuDjk9AI4UvM1igYpuAcwu62tV3LA3nFJdpQ124qKmp15apkGSPu20Uz2Zuj4/e8s6gkpkZrAwJPgNcbP8NZ9NnmXpmNu78mAHS/ackzUNK04AMgGKiyjBMkoe/GHtwdYsnRMo9loqQVc53DNC9G+aozyHoA1MjUG6crZI9OR5rk2kyhIoAIHW2/4g6VkgS4/bcO7TEuw3Eqlm5NZOCM0jRI2a6U4hhluGNM9iHp6feJ6sGWgoG//jx8VC7rFBg/UCVlow0U6MXswQpKnhgd398alR2SObWwLzixS4kCv0o5TDAQO/eo0JzkF88wi7mt+jLQz4/fIM21QckQ99q2AtooPH0GGvAClJ45sTpDCEh8euXTLVdvHrvcIRJLomKffOQuatnOds5wZAdJIpvdb4C25z+vaa/T4MRdUvajnSeWWYhvUXgknE0scYamh9gmlbUTMF1phD3hajfXlH8yDfH9BZCs0avCZ2R6WajcqYjYMGrOtUZ2ZCOMhzY9u6N4P7yz5vWHE9APuilDgttIgs4+pjSnVXAI6ZJYtPp+kNUYlhf1MMBpPYoEwUrsGVh+33sUqr2U90czUqDYWU0bqZHw/dcem9OBrciI8kb5WeOfGZ1lmamvN0kTgFjKzYutvM8U+UINQaoL8uWCOWmmmFAnJ8qNfeBRo3wmYkgf65wFj9p5ibUxOuAGnAZI8T5WyE9AyqQUZLiP2o7jTZhnDBdttrgTZNsYo7rHTlIR+vwLPCZYLgGqpzADPEfK4FppURdA1SJZF8dosp4j2zV02hl1jagFPlg4hmXNZWPPoCQEoQy/zkQz5r9ejke97Maalnkue6J7YDocw/aEE/7gAGOp74c/VWCmQgAD6M08yiUZ0erzPUrGr8sEeZs8cfuGFWlBaNVmqKnYqa0xQaAYhX0InBi6xDPblzclgkcie5UDTuPkF8CqQ/aHZD4NP+Kyo1pvdgwxZjetDygtbs7Qg12OhgZF0+eMAp1r8qIlMCDtWHVzPDnHcPM9fSMWISNOD5Cj9J2qUPasZfANSL9lHHXCC4EwoWtEmfJrpqTHBy0h7G4VblRAIlHRbNOEgjbuSAuCukuq4BH+/vtre4wzaMaDOJsqe3/ZyJ1tl+iu1AEgRg3QEUMTxv3BUtHZ6BGGM0D6IajQ4GyuEweiD0En7Pne0QKoBLK1b4JIDYD58lsS0rYhyUGjwD7eRtAON+8mhQk1MdZ162+89sPe+W+oHsI3e8kdhlXPUPytdOYVBrY2MTzFzoe917sP7sgN9SmtqNflf17WTj/Gtlp67ez0ZscZ4Ta+/qJw+fjETl7j2XBYG3T7LYwdtQR0C0+icxjy2zNO2rwYW2WKe5tLfCe91AQzk9UvWXqoQ/S8uXAL0MDaYXFXSUP/Scy1R62PJN7Ic/OgWCCJmPsYrLz/1G383mZFSWa1/ma2ZymtQuuHBv61WRWhp/CU/Rvn4FODeiIgjvtBlywZ/yZE35szwojN4UYFySW9NL3QwE6ZtxbAc3Sw0b5wTvgJrYi3x2l5fkXHPlYTnXXU6WhwM4UOlDABW0UJ2oo0GvRPJpZ8iuKnbx9Lkboc2+Ke3gizKGtJRqkX8pdW7buG7r7S+5hpjDWv+/xUsjkKAS2eEXGASzyI4unv5GTfZWBxBXunT5vVNl1IwiQbBZGwMTCiaUdUUWcXOs5WMrwaxQTZy88qToap2QMnERp6wRIwejqJ0/4oLmAOGmWlbwt79gc4FH22Hm0IyEKPdIVPLXT+yWlO/oP3mBpGV4Adil/cKNRuGvG7yFrWmk8OmgH2svBHOqX2wCLUZNYBpbXpC5btfDhYBgV7RMEWkCvzPJgQ+z+lJ/d6UH2myZKP8frYhjnwLcDN7cUzgsG8BpRhzPh4kLsYbhkOv+ANiLHyZD51Y4ZcB7wW8ZVxJ/Lwnop5/suRMGIszssVVY/IeHZ3jkLfcpU222AN9kKu3HIMKd5J6bAQCXJbIVRz7UcJDLtH8hhMQ3hCn+1bu4P0u04OBsJj5QMqXoI/Q6+QT6yUXlFoxhupBitEf1ptMa/MfXL27PzJ0CGB0HTnoNAK+jfwzvczlwSE2QoBQz/vrHRh5M1y5d778oQIoxnuob/gESV1sap2Q+1mf+UTfLP3f8vAHrFDLwa/HAmmJJlsbJbeYQdcdd4QQ4JYj8+bBPfBhbuFPumZMveOFH1hC0IL8PKAnr2w5wGmPTo+6u2t40G1vODBujTD3JgsL22o0MAD+EpIRl2oq6gUBVVc/dbS9a9QM4yK/GhY2E7tcijiMr4ua/SpU3UayGpUx7NDT/V/kkQZ2gJKVtECdSwRi57LoOXHOE2PBUMi2QwpA6gBt0es3chXIbhQiP40Sb/j6VxWxMJRb4rKsxrUg7JT4vrK3pqdTxCzDzA/+KzajceMtMAEW0BMtmLywWFFayqA3JFuHAZadl7R8qyO+tJKlZkJZUYhxUlrsD+2zJ+pgKtHg3W2aHYstcxcYYnEQnLIBMv+s7eTO2TIYHS5Pu7+2Dl8DeStmAh5cyv7Z8jELmb8s+vIzSMP7qAfRpowqRwwm55W0QePHjWleRwK8EzXWl6bmWAD2N6gUYrXBMUU6MD3lewky1SXEdhcRSY1MT0cxiicpE7Lcd7vroS+z0pfyylE6kxsbMH7WmzPQh+1PdduVEJ9qOJKnjc8l2kZiKpAx6YvFS4lc/SBRSKu9U5PbZLUaMuu4vpbdiNuiKtFK+iKj6iNlfqM15S06b1JpApHy6MqytAMbzaiUTB//1WMpF1FJZ9YNVZAeJiLJbjLEmGZJ47/SSknhSCGmc9jZRStML5xcD6MvFv0Z69jeUmhK1Pn8laYoJhb5GVkL2kUdZ7P4UvyT3Qo5SnEmI0ViLOTQQZNdK38efUMvXAKfTh6qGNgP/PSKIyma+vru7VX6EiKhJ4DTwAGJEb+5oT5tfroZeDt3PdS2l8dIRHJ6oJTX6JiHtLl/lCTdeiOLD3scK7kt2TfNp8AocZr3vC1s2EM6WFDdy2cQKMXWuiFZ9fxSbISW1rVB1MOkwOWWK5yvsQiPxrgWUypQeds7SmQwkFvhAHMh8EeAnZWWDO6jLGbyxRGab6WFfAFDbvsXVSVNidlI+x1cQzPzRpKa6DdBsglU0WybLkfJ5nRBe3hLqmh81cWMhq3FjG7BJo4JrsLuVZ9nr+qToL4fJ04AEldUq87CZ0lytCHMn//C2S8ITm0XaopygIOIXbxAPg6NH8YgusQFr3SOij7gIv3+UGkAiMlqnXKB5LPGXAIi5hUcBidATUfZuexWshxrcWt4x41kuPMbQyBngTNB8Q8W99Z3zLoU0UsI1ZJWBFLRr0NAuS3CUPeFm8MwezGQq9HdxG7Y9ma5laWi/qOwiNv26fWUqmlSbfgqt6i8axLTmN0Xsn72rVcrf5hCdnZ31xlLx5AZtI6gZuExXFyfpAArnFxI9GQ7yJMZdpQm36QFyiX/gfMaRo+1dFxNqZOE7HvEQ2GvEd111+f/XGkYBevkJIFC8jbrOLts5xueGpnUC8JbHDFxcbqK8/kKAPncuS85D9z9/3WxiPac2iB7TDXJUUqwGgTX81/UmaF3k2D/0WfU/CxGBojge+gBU7yHrAAfrrgXkD/wLzv5BWkhWO1rVY+TULcTr7WyPkdqNNUCqBIFQeQPeaqvynZkxVInzLpZg8jaJ3S/y+EVCOmYVXzXemOYcNQfj1Z62YlUW6z8Q9ul6ITHO3aHzzTUzKS1eVjN3EGf0zA4oQCFQPE7GOLGNI10Fe3kW9MiIRgO4YGzzALU04qe9SvEInImDiS0dTGFgnU1iq3wUSlwi04kQc6rDh60tClfDd+z02mngt4hots/Hb3yn1EjhGiShY5bh5d4UGtqEEpTnaRiyo1dniIUnqD34O0jUgpku4I2zMQRlSBfIQujdmVjOLD8YJRgawwzPNdlyOVG3xAUvqWMneGieANB13N5NRxSYAUile/VS6ZHdMWXFJxm1bFwdUX7YzSBiFfgxnxOBOYElRMJmO/kCTkBtemfp/0b8/bTGIPSYgzdJsw/pjAtcTcOokZ5ELfDicTRXyUxIrBhZc+g/fhJDUorZfJRTsAsNfo37/0p3plORsiNYkBCuBIG4aq9bFZQlAObcD2IMVsnW5/dbU9F/57YjJ8eomjB5BBe/BEG1EJmkzDmpeNLPeDccm/pKZNDCvvfg2Gyc6cj8y7K6zWtzy5PerwvTSJ1zHzfa/Ee6ufhWvgX4tv2AWXNJx09XUxOJpjSV2iM9zupbm2R1NxXbtQ7Xp7fzuWPZTiCkqo3TYGgmAHAGuRYQceR9503QDQsFPipV81mrJXo2ffpkuoaEsTq2a/lxhLi0Ti+zbLk1whjll3jhiFg6dmA/zQTQjmixSoLmDSYDE45zjfgbg5y5dm6DYXkHBrdssUzmGj+dPGacqYvE+CyuJMgs9FOB86+7qKHDANh2rEPlzDyBAiPTHwu8AINvT3s2xfUiCLoHU3b7icmiZIbL/DUEjJ5c0/96zbiI5zEUQvBf/Wlm/Rc6wy1+sT+B3WV2jCADVnugbFmbb5e40GywCXxWg4L+Yfv/xQ2/Ph6Tg9VtTLjll3btT6HBjvQTYxU1w1WPFriMgPD2DZvyNRXFaXce6oalVP5VWYHPAAtVTDFtnONZJBahpzixFxbf+h3nNd3PvAf0BLZH8+fNtQ3V0TJ9iqt+1er40apykXtFyYQXYR0fRmG9OI/izFBZHYqaEJxhW1uy4cRNiUX6eauB2brX8RrLv1sDotjKku+qncZK7ySCbe+W4EAY/ggYcQtTyKl2WKZ4a3dxJS7XALKCmf//ZhMd5szxzlJ7XGXKvtx7Y2yjYNcTH7M0tbzwAP4BB3Vh5OZFPDZcW/4EjzAJX2zKMaMaF1qabmd1jbtKYOeYxk6hn3qUPNgSxavssPYCEqIm9JexzGDfTO/KUwRD4p3OzAN1UaDMdgTE/PFOZO8yPgw9KIAxslf7fveTAKqYfAHBO1xwsEqh4g2IskLqd41eGdF+aLNtKP33vIQUW/whCYpLsym52I3YSpG4zKDERbzwCawYJyb56fwTkloFStM+4tP3fXq033uu56dKkTNoFNwbFgzC6tpwamkxpRCSeQxQSS5Jzfgu3iqPBPBMAWQ57jTCeP9qQuRWxHI1ADaAwqOefGLYVB1xVmtdffm/qBfRSbdqhZWy6blun86hKukDg3/LOMBbxQQP08qVStuK21Y7KabI30p7kb09OFTtrnCjcpmT4yHyQ2h9OW20TY43wul+OlHWoFMdCzQuw4On3/tqR7mwhIVUkJtRKsSS+5S0PSy4zrOaQVMwnvWOAPiVBYtwo74RCMPk97DYcJRi0zOjKD0/95wxWLvy32dxfc2YT2ThYeKJKfHoqOwJ2+IIcXu2BBA3A5cxpISl0TUBk5JaQTvU2HT2Gj6uiHEvD5ShvbsJ1UsZN/ZAUr6dsewpCQa8cRsRSVndtQwhzJmEhlb13Aim8KTUHVf4kxNbAEdlTaEGsltqfJWqYXmkNiw7wRYuej1XHXyyBhWTjGKDlvBQ+iBOhmAv6tb55P6rH+IswMjKRQvCfmQFq5s0RCFzxklwksy6q9q28cTlQcfCbncDS0A/xnjxRqnScNS7VlSAkKB37YMGMf85iUJIosRoP20XL6YvfXx+awAmtd73ANJsCMz+a1BXPiTu4bjIbCKmGZCXJCMgHrUilTxFIiuW//Ii0H15rCumr7XWrJOalmTDh0u2DgOp7E4o9tT/+ezc7HmTRkh2MmeoGuh0GL6WKcFWIfwe4y0HV03U9VoJY7xdC/APNcin0UU7hB73mbXyqYXsE//1XkUZiKOzhuqmAPVBGoicCx6Q1IZMShuXwN6W+YpIX83r3VJYZ0VzeDTCiJza5jkSTtg1W5a6uZBeDk8rSH5Mn6xFQ42tFPaFQVBJQvdQN95as7be5Lp9Z/3XvEtc3eH2fVrVWRT16JfPJauSa8oTUfDdcU5CKMKDYCo2MvqXQSRTDvoxnE05l3e+AP7quSk/ZQ1ue9BjMaPDHXzbbRhoeGY2o6y7XPO3rsJf3YxPnq1qpRbcDTnP2j7eTD2qUFzFk54DeJQbZIBBS9w0S4qIvleHTd1gCJlRBpGwtccDNFrZE1al7oj5mKKAsap/aA+UVyxFVYiZFxFRDtXn2+rhR7Coz7JYQsQuI4nDAJqIFYBrFFsNbYarfgaN8Z6DZYRT/YpoU1pT3CO+rw9LwLjzT3oMABxZfxUzysEzcWuYJDt43e2B9ChUTajvx10i/31e8o9t/8pFHDmZHYdDD/Cg7/CUVqk1xn9n2vHoMNj0iTbszrsarOUPH9YaEZNcQ0ug/q4Ve2D8oNyhDyZZAC6MsFgsPhTQwRcCn77DRVrOtzdn4RWIwpFKeC3SaB/dmag1cZ+HU6qo42p89SxHF3qSZ04FPP0edgGUxeHuUPAyvtshVJODI5dstoegeIm+1M8NpSYa6UyGonWe1JX107r3IqIT3lo8J5/fliEyiR27IrqNoGc6lXu2/Ou10gqmAETVuzb/0AfIUP2GbfJFo8O02GLcG3mhVOeHq4UzMGyQEZiTU1gBQ0AugIt4kVAFWfGjh4nlStO05jXsO2Fx4BKpRdPGgqJZIU32HdecM1RmiRD72RLxKIPGWDFrgqMXEXcZ81X0NdWYO2ounmCg77v+QJSWv8+MV7ao3PkGp+aiADXgYEC22/gtV3suuyjBk0NSmjpwbMQpDkz7BivJnXQnde4l56PUKifuRCI7QzoarIiNXYzECPDup0f6A46bMU7Ztn9K4Xti0hFH9Vv8gD7CMdrKHhQRJFoOp6s+mC2o15sOUE8J8XYeAzFtIKkcBzPiFTPfzhVbFURJQZeMmgSUAEGFLeSnBbo6StL1qZ145b/0TnWlgpNx8U2fFgJm1XAck0NUjFw9x3fx+5e80NPfL8VK4ik29nYAFcbAmpX93c95+hZKR4DwnJPJTUPYtLfffttyKgLpk4Q2KUZk1qDyISW/XULJ8/La3pdCeqy+K3kbgUB+S9K10slx8Sidm+6PAFyivXJHHjA821p6Ipad3wrVsg1SuOYEUjTFukcwdPfx+qblI1vX1pNnRvO/3ZaK2RRej7TisJvZr1cIinWDldGEMOuStyZ6RahZAoMIPGGz3VbZ+rynNRH1YxyzFjQWofY3qNIKWtorHBL9dW/u0vGFMivwAlxyGeUnDlDA/85XAPGJ4+zQVLC2Zlp4uRDLzcmSwfPgFiLGqZDfSpnXDb6sua9VPLLNxuXUiso20+E2kCfgBaIo0NolCzyfrYw9piuduf5ikZcayChHuC9/lzMX0FK8Za558jK5kE83T8iEEpCE7nZddt0sBp7GErc7nZ+HL3JpQMoyfq4MU2BJEH2JAD0hapxGsKZEUhhQ/YZZtaQnu83NAY0+APmhVyWVF+i/rYAkjbJ58EtY0w/nR3fgYRi9i/vlFz8IdQMTq4kruEM+UHc295txs84feue2Akx3b3GN1e8mi9NK4bbruvFyo4IT5KUSWdf/44m8bQVzgNb/IygrdI2yFrTxs+3TuaN8AF3IGoopisOClAUKxXzSROSOPQ2gluxdHMRKhbIwRmOKELkxxpzefFkq72Pw5Kc+o9I5yQcyWsQYs2/fjOScAHDTfjO5e7biU+6NXon9KbscF97OuAOe43VXoIDrY8wSzeejkPT/+Ycxu+fSgrsqLJ8l6lzormQHgm0ReyamgR19AKw1IZCZRcomnsq2MLXQORjlZXV2qxvKHeMHpO+zJ8azsoYJT3mKc5/IGVYJZm1sCffp2YryUSV/oYxPl8v3VFVdtzHhIDHVkKq2bVpkspHzH3NUM9ym0CwJoWtRQ9fhQi8HsBUXTZQs1w8B0uvnzcSI+44mHTjoayEXpYjr36yMAHWpEDARRCr7+rz2h1XJEsCbia3XB5XzJ400odLxqlDmjDFlysh320poGgNGnY4oijDAZr1dHFVz+5EpxBUZ9ham2ofUPFqMj6ewP2biVjILsbBrIXBCtvmm2QO1cKZ08bbnwoR3y6C0U9oi3U9dUn6FnrOVn4Xlsu0dkEg6ulkvAAOxSU9TCJqsk1XEsPAblqAcyLS6P820jNYDzqWIyimiXdCDqKKXFUpYjsUMj+fOLgnraSC6dxLYPB395xzuEDKTvjA25L7ioMX53OC+BXZ3efvG+xEoYw8xPseVKMTdkK7cWV9or0aZZMBKLRrg3M45shVZ4QeqxL2E6NbpmkpBAM5NXyQJk+abXHy3JnW6d9NXnEXuarh0vFkQVHU2u032v5q+quxQKbT8Uoyjf2AnN9HQF1rEy9G8Tz3gU")`, backgroundRepeat: 'repeat', backgroundSize: '128px 128px' }}
      />

      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-white/40 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-black/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: smoothEase }}
        className="w-full max-w-[460px] bg-white/80 backdrop-blur-3xl rounded-[32px] p-8 sm:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-white relative z-10 flex flex-col"
      >
        <div className="flex justify-center mb-8 shrink-0">
          <Link href="/" className="outline-none rounded-full">
            <AdaptedLogo />
          </Link>
        </div>

        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-3 text-[#0B0C0D]">
            {title}
          </h1>
          <p className="text-[#8D9195] font-medium text-[15px]">
            {subtitle}
          </p>
        </div>

        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          
          {/* Full Name Input */}
          <div className="relative group w-full">
            <label htmlFor="fullName" className="sr-only">Full Name</label>
            <div className={`absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors duration-300 z-10 ${activeInput === "fullName" ? "text-[#0B0C0D]" : "text-[#8D9195]"}`}>
              <UserIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              id="fullName"
              placeholder="Name and Surname"
              onFocus={() => setActiveInput("fullName")}
              onBlur={() => setActiveInput(null)}
              className="peer w-full bg-[#F3F4F4] [&:-webkit-autofill]:shadow-[inset_0_0_0_9999px_#F3F4F4] [&:-webkit-autofill]:[-webkit-text-fill-color:#0B0C0D] focus:[&:-webkit-autofill]:shadow-[inset_0_0_0_9999px_#fff] border-2 border-[#8D9195]/20 text-[#0B0C0D] text-[15px] font-medium rounded-xl py-4 pl-12 pr-4 outline-none transition-all duration-300 focus:bg-white focus:border-[#0B0C0D] focus:shadow-[0_4px_20px_-10px_rgba(11,12,13,0.1)] placeholder-[#8D9195]"
            />
          </div>

          {/* Phone Input */}
          <div className="relative group w-full">
            <label htmlFor="phone" className="sr-only">{t("extra.t297") || "Phone Number"}</label>
            <div className={`absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors duration-300 z-10 ${activeInput === "phone" ? "text-[#0B0C0D]" : "text-[#8D9195]"}`}>
              <Phone className="w-5 h-5" />
            </div>
            <input
              type="text"
              id="phone"
              placeholder="+998 90 123 45 67"
              onFocus={() => setActiveInput("phone")}
              onBlur={() => setActiveInput(null)}
              className="peer w-full bg-[#F3F4F4] [&:-webkit-autofill]:shadow-[inset_0_0_0_9999px_#F3F4F4] [&:-webkit-autofill]:[-webkit-text-fill-color:#0B0C0D] focus:[&:-webkit-autofill]:shadow-[inset_0_0_0_9999px_#fff] border-2 border-[#8D9195]/20 text-[#0B0C0D] text-[15px] font-medium rounded-xl py-4 pl-12 pr-4 outline-none transition-all duration-300 focus:bg-white focus:border-[#0B0C0D] focus:shadow-[0_4px_20px_-10px_rgba(11,12,13,0.1)] placeholder-[#8D9195]"
            />
          </div>

          {/* Password Input */}
          <div className="relative group w-full">
            <label htmlFor="password" className="sr-only">{t("extra.t288") || "Password"}</label>
            <div className={`absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors duration-300 z-10 ${activeInput === "password" ? "text-[#0B0C0D]" : "text-[#8D9195]"}`}>
              <Lock className="w-5 h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="••••••••"
              onFocus={() => setActiveInput("password")}
              onBlur={() => setActiveInput(null)}
              className="peer w-full bg-[#F3F4F4] [&:-webkit-autofill]:shadow-[inset_0_0_0_9999px_#F3F4F4] [&:-webkit-autofill]:[-webkit-text-fill-color:#0B0C0D] focus:[&:-webkit-autofill]:shadow-[inset_0_0_0_9999px_#fff] border-2 border-[#8D9195]/20 text-[#0B0C0D] text-[15px] font-medium rounded-xl py-4 pl-12 pr-12 outline-none transition-all duration-300 focus:bg-white focus:border-[#0B0C0D] focus:shadow-[0_4px_20px_-10px_rgba(11,12,13,0.1)] placeholder-[#8D9195]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#8D9195] hover:text-[#0B0C0D] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0B0C0D] rounded-xl z-10"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="pt-2">
            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-full bg-[#151719] text-white font-bold text-[15px] tracking-wide rounded-full py-4 flex items-center justify-center gap-2 shadow-[0_10px_30px_-10px_rgba(21,23,25,0.4)] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#151719]"
            >
              {t("extra.t401") || "Create Account"}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>

        </form>

        {/* Login Link */}
        <p className="text-center text-[14px] text-[#8D9195] font-medium mt-8">
          <span className="mr-1">Already have an account?</span>
          <Link href="/designlogin" className="text-[#0B0C0D] font-bold hover:underline transition-all outline-none focus-visible:underline">
            Log in
          </Link>
        </p>

      </motion.div>
    </div>
  );
}

export default function DesignSignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#D8DADC]" />}>
      <DesignSignupContent />
    </Suspense>
  );
}
