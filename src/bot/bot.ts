import { Telegraf, Markup, Context } from 'telegraf';
import { supabase } from './db';
import type { Business, Service, Staff, Booking } from '../types';

interface Profile {
  id: string;
  telegram_id: number;
  full_name?: string;
  phone?: string;
}

interface BookingState {
  messageId?: number;
  bizId?: string;
  srvId?: string;
  serviceName?: string;
  staffId?: string;
  staffName?: string;
  date?: string;
  time?: string;
}

interface ReviewState {
  bookingId: string;
  rating: number;
}

interface MyContext extends Context {
  session: {
    profile?: Profile;
    booking?: BookingState;
    review?: ReviewState;
    auth?: {
      mode: 'login' | 'signup';
      step: 'choose_method' | 'identifier' | 'phone' | 'password' | 'firstName' | 'lastName';
      loginType?: 'phone' | 'email' | 'name';
      identifier?: string;
      firstName?: string;
      lastName?: string;
      phone?: string;
      password?: string;
    };
  };
}

const botToken = process.env.TELEGRAM_BOT_TOKEN;
if (!botToken) {
  throw new Error("TELEGRAM_BOT_TOKEN is not set!");
}

export const bot = new Telegraf<MyContext>(botToken);

// Custom Supabase session middleware
bot.use(async (ctx, next) => {
  const key = `session:${ctx.from?.id}`;
  if (!ctx.from) return next();
  
  try {
    const { data, error } = await supabase
      .from('telegraf_sessions')
      .select('session_data')
      .eq('id', key)
      .single();
      
    ctx.session = data?.session_data || {};
  } catch (err) {
    ctx.session = {};
  }

  await next();

  if (ctx.session) {
    await supabase
      .from('telegraf_sessions')
      .upsert({ id: key, session_data: ctx.session });
  }
});

// Authentication middleware
bot.use(async (ctx, next) => {
  if (ctx.from) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('telegram_id', ctx.from.id)
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') {
          console.error("Middleware Supabase error:", error);
        }
      } else if (profile) {
        ctx.session.profile = profile;
      }
    } catch (e) {
      console.error("Middleware exception:", e);
    }
  }
  return next();
});

// Menus
const mainMenu = Markup.keyboard([
  ['📅 Book Service', '📝 My Bookings']
]).resize();

const requireAuth = async (ctx: MyContext): Promise<boolean> => {
  if (!ctx.session?.profile) {
    await ctx.reply('Welcome to Elara! 👋', Markup.removeKeyboard());
    await ctx.reply(
      'Please choose an option to continue:', 
      Markup.inlineKeyboard([
        [Markup.button.callback('🔑 Log In', 'auth_login'), Markup.button.callback('📝 Sign Up', 'auth_signup')]
      ])
    );
    return false;
  }
  return true;
};

bot.action('auth_login', async (ctx) => {
  if (ctx.session.profile) {
    await ctx.answerCbQuery("You are already logged in!", { show_alert: true });
    return;
  }
  ctx.session.auth = { mode: 'login', step: 'choose_method' };
  await ctx.answerCbQuery();
  await ctx.reply(
    'How would you like to log in?',
    Markup.inlineKeyboard([
      [Markup.button.callback('📱 Phone', 'login_phone')],
      [Markup.button.callback('📧 Email', 'login_email')],
      [Markup.button.callback('👤 Username', 'login_name')]
    ])
  );
});

bot.action('login_phone', async (ctx) => {
  if (ctx.session.auth?.mode !== 'login') return;
  ctx.session.auth.step = 'identifier';
  ctx.session.auth.loginType = 'phone';
  await ctx.answerCbQuery();
  await ctx.reply('Please share your phone number (or type it):', Markup.keyboard([Markup.button.contactRequest('📱 Share Phone Number')]).resize());
});

bot.action('login_email', async (ctx) => {
  if (ctx.session.auth?.mode !== 'login') return;
  ctx.session.auth.step = 'identifier';
  ctx.session.auth.loginType = 'email';
  await ctx.answerCbQuery();
  await ctx.reply('Please enter your email address:', Markup.removeKeyboard());
});

bot.action('login_name', async (ctx) => {
  if (ctx.session.auth?.mode !== 'login') return;
  ctx.session.auth.step = 'identifier';
  ctx.session.auth.loginType = 'name';
  await ctx.answerCbQuery();
  await ctx.reply('Please enter your username:', Markup.removeKeyboard());
});

bot.action('auth_signup', async (ctx) => {
  if (ctx.session.profile) {
    await ctx.answerCbQuery("You are already registered!", { show_alert: true });
    return;
  }
  ctx.session.auth = { mode: 'signup', step: 'firstName' };
  await ctx.answerCbQuery();
  await ctx.reply('Please enter your First Name:', Markup.removeKeyboard());
});

// Start Command
bot.start(async (ctx) => {
  if (await requireAuth(ctx)) {
    const name = ctx.session.profile?.full_name || 'Customer';
    return ctx.reply(`Welcome back, ${name}! ✨\n\nHow can I help you today?\nType /help for more options.`, mainMenu);
  }
});

bot.command('help', async (ctx) => {
  if (!(await requireAuth(ctx))) return;
  return ctx.reply('Need help or want to manage your account? Choose an option below:', 
    Markup.inlineKeyboard([
      [Markup.button.callback('🎫 Support Tickets', 'cmd_tickets'), Markup.button.callback('🆘 New Ticket', 'cmd_new_ticket')],
      [Markup.button.callback('👤 Profile', 'cmd_profile')],
      [Markup.button.callback('🚪 Log Out', 'cmd_logout'), Markup.button.callback('❌ Delete Account', 'cmd_delete_account')]
    ])
  );
});

const handleSignupComplete = async (ctx: MyContext) => {
  const auth = ctx.session.auth!;
  try {
    let phone = auth.phone!;
    if (!phone.startsWith('+')) phone = '+' + phone;

    const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
      phone: phone,
      password: auth.password,
      phone_confirm: true,
      user_metadata: { full_name: `${auth.firstName} ${auth.lastName || ''}`.trim() }
    });
    
    if (authErr) throw authErr;
    
    const userId = authData.user.id;
    
    const { data: updatedProfile, error: updateErr } = await supabase
      .from('profiles')
      .update({ telegram_id: ctx.from!.id })
      .eq('id', userId)
      .select()
      .single();
      
    if (updateErr) throw updateErr;
    
    ctx.session.profile = updatedProfile;
    ctx.session.auth = undefined;
    ctx.reply("✅ Successfully registered and logged in! Welcome to Elara.", mainMenu);
  } catch (err: any) {
    console.error("Signup error:", err);
    if (err.code === '23505' && err.message?.includes('telegram_id')) {
      ctx.reply(`❌ You are already registered with this Telegram account! Please type /start to continue, or choose Log In instead.`, Markup.removeKeyboard());
    } else {
      ctx.reply(`❌ Signup failed: ${err.message || "Unknown error"}. Try again with /start.`, Markup.removeKeyboard());
    }
    ctx.session.auth = undefined;
  }
};

const handleLoginComplete = async (ctx: MyContext) => {
  const auth = ctx.session.auth!;
  try {
    let identifier = auth.identifier || auth.phone;
    if (!identifier) throw new Error("No login identifier provided");

    // Mimic AuthService logic
    let isPhone = auth.loginType === 'phone' || identifier.startsWith('+') || /^\d+$/.test(identifier.replace(/\D/g, ''));
    if (isPhone && !identifier.startsWith('+')) identifier = '+' + identifier;

    const authOpts = isPhone ? { phone: identifier, password: auth.password! } : { email: identifier, password: auth.password! };

    const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword(authOpts);
    
    if (loginErr) throw loginErr;
    
    const userId = loginData.user.id;
    
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .update({ telegram_id: ctx.from!.id })
      .eq('id', userId)
      .select()
      .single();
      
    ctx.session.profile = updatedProfile || { id: userId, telegram_id: ctx.from!.id, phone: isPhone ? identifier : undefined };
    ctx.session.auth = undefined;
    ctx.reply("✅ Successfully logged in! Welcome back.", mainMenu);
  } catch (err: any) {
    console.error("Login error:", err);
    ctx.reply(`❌ Login failed: ${err.message || "Unknown error"}. Try again with /start.`, Markup.removeKeyboard());
    ctx.session.auth = undefined;
  }
};

// Text and Contact interceptors for Auth
bot.on('contact', async (ctx, next) => {
  const auth = ctx.session.auth;
  if (!auth) return next();
  
  const contact = ctx.message.contact;
  if (contact.user_id !== ctx.from.id) {
    return ctx.reply("❌ Please share your own phone number.");
  }
  
  if (auth.step === 'identifier' && auth.loginType === 'phone') {
    auth.identifier = contact.phone_number;
    auth.step = 'password';
    return ctx.reply("Please enter your password:", Markup.removeKeyboard());
  } else if (auth.step === 'phone') {
    auth.phone = contact.phone_number;
    auth.step = 'password';
    return ctx.reply("Please create a password:", Markup.removeKeyboard());
  }
});

bot.on('text', async (ctx, next) => {
  if (ctx.session.review) {
    const text = ctx.message.text.trim();
    const bookId = ctx.session.review.bookingId;
    if (!text.startsWith('/')) {
      await supabase.from('bookings').update({ review_text: text }).eq('id', bookId);
    }
    ctx.session.review = undefined;
    await ctx.reply("Thank you for your feedback!");
    await renderLiveTicket(ctx, bookId, false);
    return;
  }

  const auth = ctx.session.auth;
  if (!auth) return next();

  const text = ctx.message.text.trim();
  
  if (text.startsWith('/')) {
    ctx.session.auth = undefined;
    return next();
  }
  
  if (auth.mode === 'signup') {
    if (auth.step === 'firstName') {
      auth.firstName = text;
      auth.step = 'lastName';
      return ctx.reply("Please enter your Last Name:");
    } else if (auth.step === 'lastName') {
      auth.lastName = text;
      auth.step = 'phone';
      return ctx.reply("Please share your phone number (or type it):", Markup.keyboard([Markup.button.contactRequest('📱 Share Phone Number')]).resize());
    } else if (auth.step === 'phone') {
      auth.phone = text;
      auth.step = 'password';
      return ctx.reply("Please create a password:", Markup.removeKeyboard());
    } else if (auth.step === 'password') {
      auth.password = text;
      return handleSignupComplete(ctx);
    }
  } else if (auth.mode === 'login') {
    if (auth.step === 'identifier') {
      auth.identifier = text;
      auth.step = 'password';
      return ctx.reply("Please enter your password:", Markup.removeKeyboard());
    } else if (auth.step === 'password') {
      auth.password = text;
      return handleLoginComplete(ctx);
    }
  }
  
  return next();
});

// --- BOOKING FLOW ---
bot.hears('📅 Book Service', async (ctx) => {
  if (!(await requireAuth(ctx))) return;
  
  ctx.session.booking = {}; // Reset booking state
  
  const { data: businesses } = await supabase.from('businesses').select('*');
  if (!businesses || businesses.length === 0) return ctx.reply("We are currently not accepting bookings. Please check back later.");

  const buttons = businesses.map(b => [Markup.button.callback(`🏢 ${b.name}`, `biz_${b.id}`)]);
  
  const msg = await ctx.reply("<b>Step 1: Select a Location/Business</b>\n\nWhere would you like to book?", {
    parse_mode: 'HTML',
    ...Markup.inlineKeyboard(buttons)
  });
  
  ctx.session.booking.messageId = msg.message_id;
});

// Helper to update booking messages cleanly
const updateBookingMessage = async (ctx: MyContext, text: string, buttons: any[]) => {
  const msgId = ctx.session.booking?.messageId;
  if (msgId && ctx.chat) {
    try {
      await ctx.telegram.editMessageText(ctx.chat.id, msgId, undefined, text, {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(buttons)
      });
    } catch (e) {
      // Message not modified or expired, send new one
      const msg = await ctx.reply(text, {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard(buttons)
      });
      if (ctx.session.booking) ctx.session.booking.messageId = msg.message_id;
    }
  } else {
    const msg = await ctx.reply(text, {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard(buttons)
    });
    if (ctx.session.booking) ctx.session.booking.messageId = msg.message_id;
  }
};

// Select Business -> Show Services
bot.action(/biz_(.+)/, async (ctx) => {
  const bizId = ctx.match[1];
  if (!ctx.session.booking) ctx.session.booking = {};
  ctx.session.booking.bizId = bizId;
  
  const { data: services } = await supabase.from('services').select('*').eq('business_id', bizId);
  
  if (!services || services.length === 0) {
    await ctx.answerCbQuery("No services available here.", { show_alert: true });
    return;
  }

  const buttons = services.map(s => [Markup.button.callback(`✂️ ${s.name} - $${s.price || 0}`, `srv_${s.id}`)]);
  buttons.push([Markup.button.callback('⬅️ Back to Locations', 'back_biz')]);
  
  await updateBookingMessage(ctx, "<b>Step 2: Select a Service</b>\n\nChoose the service you need:", buttons);
  await ctx.answerCbQuery();
});

// Back to businesses
bot.action('back_biz', async (ctx) => {
  const { data: businesses } = await supabase.from('businesses').select('*');
  const buttons = (businesses || []).map(b => [Markup.button.callback(`🏢 ${b.name}`, `biz_${b.id}`)]);
  await updateBookingMessage(ctx, "<b>Step 1: Select a Location/Business</b>\n\nWhere would you like to book?", buttons);
  await ctx.answerCbQuery();
});

// Select Service -> Show Staff
bot.action(/srv_(.+)/, async (ctx) => {
  const srvId = ctx.match[1];
  if (!ctx.session.booking) return;
  ctx.session.booking.srvId = srvId;
  
  const { data: service } = await supabase.from('services').select('name').eq('id', srvId).single();
  if (service) ctx.session.booking.serviceName = service.name;
  
  const { data: biz } = await supabase.from('businesses').select('team_data').eq('id', ctx.session.booking.bizId).single();
  
  const buttons = [[Markup.button.callback("🌟 Any available professional", `staff_any`)]];
  
  if (biz && biz.team_data) {
    const activeStaff = (biz.team_data as any[]).filter(m => m.isActive);
    activeStaff.forEach(s => {
      buttons.push([Markup.button.callback(`👤 ${s.name}`, `staff_${s.id}`)]);
    });
  }
  
  buttons.push([Markup.button.callback('⬅️ Back to Services', `biz_${ctx.session.booking.bizId}`)]);
  
  await updateBookingMessage(ctx, "<b>Step 3: Select a Professional</b>\n\nWho would you like to book with?", buttons);
  await ctx.answerCbQuery();
});

// Select Staff -> Show Dates
bot.action(/staff_(.+)/, async (ctx) => {
  const staffId = ctx.match[1];
  if (!ctx.session.booking) return;
  ctx.session.booking.staffId = staffId === 'any' ? undefined : staffId;
  
  if (staffId !== 'any') {
    const { data: biz } = await supabase.from('businesses').select('team_data').eq('id', ctx.session.booking.bizId).single();
    const staff = (biz?.team_data as any[])?.find(m => m.id === staffId);
    ctx.session.booking.staffName = staff ? staff.name : 'Any available';
  } else {
    ctx.session.booking.staffName = 'Any available';
  }

  const buttons = [];
  const today = new Date();
  
  // 7 days lookahead
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const displayDate = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    buttons.push([Markup.button.callback(`📅 ${displayDate}`, `date_${dateStr}`)]);
  }
  
  buttons.push([Markup.button.callback('⬅️ Back to Professionals', `srv_${ctx.session.booking.srvId}`)]);
  
  await updateBookingMessage(ctx, `<b>Step 4: Select a Date</b>\n\nProfessional: ${ctx.session.booking.staffName}\n\nChoose an available date:`, buttons);
  await ctx.answerCbQuery();
});

// Select Date -> Show Times
bot.action(/date_(.+)/, async (ctx) => {
  const dateStr = ctx.match[1];
  if (!ctx.session.booking) return;
  ctx.session.booking.date = dateStr;

  // Simple timeslots for demonstration
  // In a real app, query working_hours and existing bookings
  const times = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  const buttons = [];
  
  for (let i = 0; i < times.length; i += 2) {
    const row = [Markup.button.callback(`🕘 ${times[i]}`, `time_${times[i]}`)];
    if (i + 1 < times.length) row.push(Markup.button.callback(`🕘 ${times[i+1]}`, `time_${times[i+1]}`));
    buttons.push(row);
  }
  
  buttons.push([Markup.button.callback('⬅️ Back to Dates', `staff_${ctx.session.booking.staffId || 'any'}`)]);

  await updateBookingMessage(ctx, `<b>Step 5: Select a Time</b>\n\nDate: ${dateStr}\nProfessional: ${ctx.session.booking.staffName}\n\nChoose an available time:`, buttons);
  await ctx.answerCbQuery();
});

// Select Time -> Confirm Booking
bot.action(/time_(.+)/, async (ctx) => {
  const timeStr = ctx.match[1];
  if (!ctx.session.booking || !ctx.session.profile) return;
  
  const { bizId, srvId, serviceName, staffId, staffName, date } = ctx.session.booking;

  const { error } = await supabase.from('bookings').insert({
    client_id: ctx.session.profile.id,
    business_id: bizId,
    service_id: srvId,
    service_name: serviceName,
    staff_id: staffId,
    staff_name: staffName,
    date: date,
    time: timeStr,
    status: 'pending'
  });

  if (error) {
    console.error("Booking error:", error);
    await ctx.answerCbQuery("Failed to create booking.", { show_alert: true });
    return;
  }

  const msgId = ctx.session.booking.messageId;
  ctx.session.booking = {}; // clear state

  if (msgId && ctx.chat) {
    await ctx.telegram.editMessageText(ctx.chat.id, msgId, undefined, 
      `✅ <b>Booking Confirmed!</b>\n\n📅 <b>Date:</b> ${date}\n🕘 <b>Time:</b> ${timeStr}\n👤 <b>Professional:</b> ${staffName}\n\nThank you for choosing us! You can view or cancel this in "My Bookings".`, 
      { parse_mode: 'HTML' }
    ).catch(() => {});
  }
  
  await ctx.answerCbQuery("Booking confirmed!", { show_alert: true });
});

// --- MY BOOKINGS ---
// --- MY BOOKINGS ---
bot.hears('📝 My Bookings', async (ctx) => {
  if (!(await requireAuth(ctx))) return;

  const { data: bookings } = await supabase.from('bookings')
    .select('*, businesses(name)')
    .eq('client_id', ctx.session.profile!.id)
    .order('created_at', { ascending: false })
    .limit(5);

  if (!bookings || bookings.length === 0) {
    return ctx.reply("📭 You have no recent bookings.");
  }

  for (const b of bookings) {
    let serviceName = b.service_name;
    if (!serviceName && b.service_id) {
      try {
        const { data: s } = await supabase.from('services').select('name').eq('id', b.service_id).single();
        if (s) serviceName = s.name;
      } catch(e) {}
    }

    const text = `📅 <b>${b.date} at ${b.time}</b>\n🏢 ${b.businesses?.name || 'N/A'}\n✂️ ${serviceName || 'N/A'}`;
    const buttons = [[Markup.button.callback('🎫 View Live Ticket', `ticket_${b.id}`)]];

    await ctx.reply(text, {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard(buttons)
    });
  }
});

// --- LIVE TICKET ---
const renderLiveTicket = async (ctx: MyContext, bookingId: string, isEdit = true) => {
  const { data: b } = await supabase.from('bookings').select('*, businesses(name)').eq('id', bookingId).single();
  if (!b) return ctx.answerCbQuery("Booking not found", { show_alert: true });

  let serviceName = b.service_name;
  if (!serviceName && b.service_id) {
    try {
      const { data: s } = await supabase.from('services').select('name').eq('id', b.service_id).single();
      if (s) serviceName = s.name;
    } catch(e) {}
  }

  const isCompleted = b.status === 'completed' || b.status === 'done';
  const isInProgress = b.status === 'in_progress';
  
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const isToday = b.date === todayStr;

  let visualTracker = "";
  if (isCompleted) {
    visualTracker = "⚪ [Upcoming] 〰️ ⚪ Queue 〰️ ⚪ In chair 〰️ 🟢 [Completed]";
  } else if (isInProgress) {
    visualTracker = "⚪ [Upcoming] 〰️ ⚪ Queue 〰️ 🟢 [In chair] 〰️ ⚪ Completed";
  } else if (isToday) {
    visualTracker = "⚪ [Upcoming] 〰️ 🟡 [Queue] 〰️ ⚪ In chair 〰️ ⚪ Completed";
  } else {
    visualTracker = "🟡 [Upcoming] 〰️ ⚪ Queue 〰️ ⚪ In chair 〰️ ⚪ Completed";
  }

  let text = `🎫 <b>𝗟𝗜𝗩𝗘 𝗧𝗜𝗖𝗞𝗘𝗧</b> — #${b.id.substring(0,6).toUpperCase()}\n\n`;
  text += `🏢 <b>${b.businesses?.name || 'Unknown Venue'}</b>\n`;
  text += `✂️ ${serviceName || 'Service'}\n\n`;
  text += `📅 <b>${b.date}</b>\n`;
  text += `🕘 <b>${b.time}</b>\n\n`;
  text += `👤 Professional: ${b.staff_name || 'Any'}\n`;
  text += `➖➖➖➖➖➖➖➖➖➖\n`;
  text += `📊 <b>𝗦𝘁𝗮𝘁𝘂𝘀 𝗧𝗿𝗮𝗰𝗸𝗲𝗿:</b>\n${visualTracker}\n\n`;
  
  if (b.status === 'cancelled') {
    text += `❌ <b>This booking has been cancelled.</b>`;
  } else if (!isCompleted) {
    text += `ℹ️ <i>The professional will be available exactly on time. See you soon!</i>`;
  } else {
    text += `ℹ️ <i>Thank you for your visit!</i>`;
  }

  const buttons = [];
  
  if (b.status !== 'cancelled') {
    if (isCompleted) {
      if (!b.rating) {
        buttons.push([
          Markup.button.callback('⭐', `rate_${b.id}_1`),
          Markup.button.callback('⭐⭐', `rate_${b.id}_2`),
          Markup.button.callback('⭐⭐⭐', `rate_${b.id}_3`)
        ]);
        buttons.push([
          Markup.button.callback('⭐⭐⭐⭐', `rate_${b.id}_4`),
          Markup.button.callback('⭐⭐⭐⭐⭐', `rate_${b.id}_5`)
        ]);
      } else {
        text += `\n\n🌟 <b>You rated:</b> ${b.rating}/5`;
        if (b.review_text) text += `\n💬 "${b.review_text}"`;
      }
    } else {
      buttons.push([Markup.button.callback('🔄 Refresh Status', `refresh_${b.id}`)]);
      buttons.push([
        Markup.button.callback('🗺 Directions', `noop`),
        Markup.button.callback('📞 Contact', `noop`)
      ]);
      buttons.push([Markup.button.callback('❌ Cancel Booking', `cancel_ask_${b.id}`)]);
    }
  }

  if (isEdit) {
    await ctx.editMessageText(text, { parse_mode: 'HTML', ...Markup.inlineKeyboard(buttons) }).catch(() => {});
  } else {
    await ctx.reply(text, { parse_mode: 'HTML', ...Markup.inlineKeyboard(buttons) });
  }
};

bot.action(/ticket_(.+)/, async (ctx) => {
  await ctx.answerCbQuery();
  await renderLiveTicket(ctx, ctx.match[1], true);
});

bot.action(/refresh_(.+)/, async (ctx) => {
  await renderLiveTicket(ctx, ctx.match[1], true);
  await ctx.answerCbQuery("Refreshed!");
});

bot.action('noop', async (ctx) => ctx.answerCbQuery());

bot.action(/cancel_ask_(.+)/, async (ctx) => {
  const bookId = ctx.match[1];
  await ctx.editMessageText(
    `⚠️ <b>Are you sure?</b>\n\nCanceling in advance helps professionals manage their time and maintains your reliability karma.`,
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('Yes, cancel it', `cancel_confirm_${bookId}`)],
        [Markup.button.callback('No, keep it', `refresh_${bookId}`)]
      ])
    }
  );
  await ctx.answerCbQuery();
});

bot.action(/cancel_confirm_(.+)/, async (ctx) => {
  const bookId = ctx.match[1];
  await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookId);
  await renderLiveTicket(ctx, bookId, true);
  await ctx.answerCbQuery("Booking cancelled.");
});

bot.action(/rate_(.+)_(.+)/, async (ctx) => {
  const bookId = ctx.match[1];
  const rating = parseInt(ctx.match[2]);
  
  await supabase.from('bookings').update({ rating }).eq('id', bookId);
  
  ctx.session.review = { bookingId: bookId, rating };
  
  await ctx.editMessageText(
    `⭐ <b>You rated ${rating}/5!</b>\n\nPlease type your review text below and send it as a message, or click "Skip" to submit without text.`,
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([[Markup.button.callback('⏭ Skip', `skip_review_${bookId}`)]])
    }
  );
  await ctx.answerCbQuery();
});

bot.action(/skip_review_(.+)/, async (ctx) => {
  const bookId = ctx.match[1];
  ctx.session.review = undefined;
  await renderLiveTicket(ctx, bookId, true);
  await ctx.answerCbQuery();
});

// --- TICKETS ---
const showNewTicket = async (ctx: MyContext) => {
  if (!(await requireAuth(ctx))) return;
  if (ctx.callbackQuery) await ctx.answerCbQuery();
  ctx.reply("<b>Support Center</b> 🛠\n\nTo create a support ticket, simply reply to this message or send a message starting with <code>/ticket</code> followed by your issue.\n\nExample:\n<code>/ticket My account needs an update.</code>", { parse_mode: 'HTML' });
};
bot.hears('🆘 New Ticket', showNewTicket);
bot.action('cmd_new_ticket', showNewTicket);

bot.command('ticket', async (ctx) => {
  if (!(await requireAuth(ctx))) return;
  
  const text = ctx.message.text.replace('/ticket', '').trim();
  if (!text) {
    return ctx.reply("❌ Please provide a description for your ticket.");
  }

  const { data, error } = await supabase.from('support_tickets').insert({
    client_id: ctx.session.profile!.id,
    subject: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
    description: text,
    status: 'open'
  }).select().single();

  if (error) {
    console.error("Ticket error:", error);
    return ctx.reply("❌ Failed to create ticket. Please try again later.");
  }

  ctx.reply(`✅ <b>Ticket Created!</b>\n\n<b>ID:</b> #${data.id}\nWe will get back to you as soon as possible.`, { parse_mode: 'HTML' });
});

const showTickets = async (ctx: MyContext) => {
  if (!(await requireAuth(ctx))) return;
  if (ctx.callbackQuery) await ctx.answerCbQuery();

  const { data: tickets } = await supabase.from('support_tickets')
    .select('*')
    .eq('client_id', ctx.session.profile!.id)
    .order('created_at', { ascending: false })
    .limit(5);

  if (!tickets || tickets.length === 0) return ctx.reply("📭 You have no support tickets.");

  let msg = "<b>Your Recent Support Tickets:</b>\n\n";
  tickets.forEach(t => {
    msg += `🎫 <b>Ticket #${t.id.substring(0,8)}</b>\n📌 <b>Status:</b> ${t.status.toUpperCase()}\n📝 <b>Subject:</b> ${t.subject}\n\n`;
  });

  ctx.reply(msg, { parse_mode: 'HTML' });
};
bot.hears('🎫 Support Tickets', showTickets);
bot.action('cmd_tickets', showTickets);

// --- PROFILE ---
const showProfile = async (ctx: MyContext) => {
  if (!(await requireAuth(ctx))) return;
  if (ctx.callbackQuery) await ctx.answerCbQuery();
  
  const profile = ctx.session.profile!;
  let phone = profile.phone;
  if (!phone) {
    try {
      const { data } = await supabase.auth.admin.getUserById(profile.id);
      if (data?.user?.phone) phone = data.user.phone;
    } catch(e) {}
  }
  
  if (phone && !phone.startsWith('+')) {
    phone = '+' + phone;
  }

  const text = `👤 <b>Your Profile</b>\n\n<b>Name:</b> ${profile.full_name || 'Not set'}\n<b>Phone:</b> ${phone || 'Not set'}\n\nTo update your profile, use our web app.`;
  
  ctx.reply(text, { parse_mode: 'HTML' });
};
bot.hears('👤 Profile', showProfile);
bot.action('cmd_profile', showProfile);

bot.action('cmd_logout', async (ctx) => {
  ctx.session.profile = undefined;
  ctx.session.auth = undefined;
  ctx.session.booking = undefined;
  await ctx.answerCbQuery();
  await ctx.reply("You have been successfully logged out.", Markup.removeKeyboard());
  await requireAuth(ctx);
});

bot.action('cmd_delete_account', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    "⚠️ <b>WARNING:</b> This will permanently delete your account, bookings, and tickets.\n\nAre you sure?",
    {
      parse_mode: 'HTML',
      ...Markup.inlineKeyboard([
        [Markup.button.callback('Yes, Delete My Account', 'confirm_delete_account')],
        [Markup.button.callback('No, Cancel', 'cancel_delete_account')]
      ])
    }
  );
});

bot.action('cancel_delete_account', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText("Account deletion cancelled.");
});

bot.action('confirm_delete_account', async (ctx) => {
  const profile = ctx.session.profile;
  if (!profile) return ctx.answerCbQuery("Not logged in.", { show_alert: true });

  try {
    const { error } = await supabase.auth.admin.deleteUser(profile.id);
    if (error) throw error;
    
    await supabase.from('profiles').delete().eq('id', profile.id);

    ctx.session.profile = undefined;
    ctx.session.auth = undefined;
    ctx.session.booking = undefined;
    
    await ctx.answerCbQuery();
    await ctx.editMessageText("Your account has been permanently deleted.");
    await ctx.reply("We're sorry to see you go! 👋", Markup.removeKeyboard());
    await requireAuth(ctx);
  } catch (err: any) {
    console.error("Delete account error:", err);
    await ctx.answerCbQuery("Failed to delete account.", { show_alert: true });
    await ctx.editMessageText("❌ An error occurred while deleting your account.");
  }
});

// Error handling
bot.catch((err, ctx) => {
  console.error(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

