const fs = require('fs');
let c = fs.readFileSync('src/features/market-pages/Landing.jsx', 'utf8');

c = c.replace(/import React, { useState, useId } from "react";/, 'import React, { useState, useEffect, useId } from "react";');

fs.writeFileSync('src/features/market-pages/Landing.jsx', c);
