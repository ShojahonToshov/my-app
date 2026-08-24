const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard-pages/Dashboard.tsx', 'utf8');

const waitingListSearch =                     {filteredWaiting.map((guest, index) => (;
const waitingListReplace =                     {isBookingsLoading ? (
                      Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white border border-[#DCDCDA] rounded-xl p-3 flex flex-col justify-between min-h-[120px] mx-1 mb-2">
                          <Skeleton className="w-24 h-4 mb-2" />
                          <Skeleton className="w-16 h-3 mb-2" />
                          <Skeleton className="w-20 h-3 mb-2" />
                          <div className="mt-auto flex justify-between items-end">
                            <Skeleton className="w-24 h-3" />
                            <Skeleton className="w-16 h-6" />
                          </div>
                        </div>
                      ))
                    ) : filteredWaiting.map((guest, index) => (;

content = content.replace(waitingListSearch, waitingListReplace);

const inChairSearch =                     {inChairGuests.map((guest, index) => (;
const inChairReplace =                     {isBookingsLoading ? (
                      <div className="bg-white border border-[#DCDCDA] rounded-xl p-3 flex flex-col justify-between min-h-[120px] mx-1 mb-2">
                          <Skeleton className="w-24 h-4 mb-2" />
                          <Skeleton className="w-16 h-3 mb-2" />
                          <Skeleton className="w-20 h-3 mb-2" />
                          <div className="mt-auto flex justify-between items-end">
                            <Skeleton className="w-24 h-3" />
                            <Skeleton className="w-16 h-6" />
                          </div>
                      </div>
                    ) : inChairGuests.map((guest, index) => (;

content = content.replace(inChairSearch, inChairReplace);

const emptyWaitingSearch =                     {filteredWaiting.length === 0 && (;
const emptyWaitingReplace =                     {!isBookingsLoading && filteredWaiting.length === 0 && (;

content = content.replace(emptyWaitingSearch, emptyWaitingReplace);

const emptyInChairSearch =                     {inChairGuests.length === 0 && (;
const emptyInChairReplace =                     {!isBookingsLoading && inChairGuests.length === 0 && (;

content = content.replace(emptyInChairSearch, emptyInChairReplace);

fs.writeFileSync('src/components/dashboard-pages/Dashboard.tsx', content, 'utf8');
