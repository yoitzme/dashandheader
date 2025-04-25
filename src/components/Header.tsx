import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Award, Bell, Calendar, CalendarCheck, ChevronDown, CheckSquare, CloudSun, Flag, Home, Menu, MessageSquareMore, Wallet, Search, Settings, ShoppingCart, Sun, Target, Thermometer, User, X, Clock, AlertCircle, FileText, Briefcase, GraduationCap, Plane, Users, UsersRound, Landmark, HardHat, Compass, Utensils, ClipboardList, Package, CreditCard, TimerOff, Timer, BarChart2, Trophy, Repeat, DollarSign, PiggyBank, LineChart, BookOpen, Cake, PartyPopper, Gift } from 'lucide-react';

interface HeaderProps {
  className?: string;
  showSearch?: boolean;
  pageTitle?: string;
  userName?: string;
  userAvatar?: string;
  onMenuToggle?: () => void;
}

// Define navigation items
interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  fixed?: boolean; // Whether the item should always be visible
  defaultVisible?: boolean; // Whether the item should be visible by default (before the "More" dropdown)
  subItems?: SubNavItem[]; // Subcategories
}

interface SubNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export function Header({
  className,
  showSearch = true,
  pageTitle,
  userName = 'User',
  userAvatar,
  onMenuToggle,
}: HeaderProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('home');
  const [currentTime, setCurrentTime] = useState('');
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [weatherData, setWeatherData] = useState({
    temp: 72,
    condition: 'Sunny',
    icon: <CloudSun className="h-5 w-5" />,
    location: 'San Francisco, CA'
  });
  
  // Reference to the More dropdown trigger button
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  
  // Define all navigation items with subcategories
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: <Home className="h-5 w-5" />, fixed: true },
    { 
      id: 'tasks', 
      label: 'Tasks', 
      icon: <CheckSquare className="h-5 w-5" />, 
      fixed: true,
      subItems: [
        { id: 'tasks-daily', label: 'Daily To-Do List', icon: <CheckSquare className="h-4 w-4" /> },
        { id: 'tasks-weekly', label: 'Weekly Planner', icon: <Clock className="h-4 w-4" /> },
        { id: 'tasks-urgent', label: 'Urgent Tasks', icon: <AlertCircle className="h-4 w-4" /> },
        { id: 'tasks-longterm', label: 'Long-Term Goals', icon: <Flag className="h-4 w-4" /> },
        { id: 'tasks-progress', label: 'Progress Tracker', icon: <Target className="h-4 w-4" /> }
      ]
    },
    { 
      id: 'calendar', 
      label: 'Calendar', 
      icon: <Calendar className="h-5 w-5" />, 
      fixed: true,
      subItems: [
        { id: 'calendar-personal', label: 'Personal Appointments', icon: <Calendar className="h-4 w-4" /> },
        { id: 'calendar-important', label: 'Important Dates', icon: <Flag className="h-4 w-4" /> },
        { id: 'calendar-work', label: 'Work Schedule', icon: <Briefcase className="h-4 w-4" /> },
        { id: 'calendar-study', label: 'Study Timetable', icon: <GraduationCap className="h-4 w-4" /> },
        { id: 'calendar-travel', label: 'Travel Dates', icon: <Plane className="h-4 w-4" /> }
      ]
    },
    { 
      id: 'events', 
      label: 'Events', 
      icon: <CalendarCheck className="h-5 w-5" />, 
      defaultVisible: true,
      subItems: [
        { id: 'events-social', label: 'Social Gatherings', icon: <Users className="h-4 w-4" /> },
        { id: 'events-family', label: 'Family Events', icon: <UsersRound className="h-4 w-4" /> },
        { id: 'events-community', label: 'Community Events', icon: <Landmark className="h-4 w-4" /> },
        { id: 'events-house', label: 'House Projects', icon: <HardHat className="h-4 w-4" /> },
        { id: 'events-vacation', label: 'Vacation Plans', icon: <Compass className="h-4 w-4" /> }
      ]
    },
    { 
      id: 'goals', 
      label: 'Goals', 
      icon: <Target className="h-5 w-5" />, 
      defaultVisible: true,
      subItems: [
        { id: 'goals-short-term', label: 'Short-Term Goals', icon: <Timer className="h-4 w-4" /> },
        { id: 'goals-long-term', label: 'Long-Term Goals', icon: <Flag className="h-4 w-4" /> },
        { id: 'goals-milestones', label: 'Milestone Planner', icon: <BarChart2 className="h-4 w-4" /> },
        { id: 'goals-habits', label: 'Habit Tracker', icon: <Repeat className="h-4 w-4" /> },
        { id: 'goals-rewards', label: 'Rewards & Incentives', icon: <Trophy className="h-4 w-4" /> }
      ]
    },
    { 
      id: 'grocery', 
      label: 'Grocery', 
      icon: <ShoppingCart className="h-5 w-5" />, 
      defaultVisible: true,
      subItems: [
        { id: 'grocery-meal-plan', label: 'Weekly Meal Plan', icon: <Utensils className="h-4 w-4" /> },
        { id: 'grocery-shopping-list', label: 'Shopping List', icon: <ClipboardList className="h-4 w-4" /> },
        { id: 'grocery-pantry', label: 'Pantry Inventory', icon: <Package className="h-4 w-4" /> },
        { id: 'grocery-budget', label: 'Budget Tracker', icon: <CreditCard className="h-4 w-4" /> },
        { id: 'grocery-expiration', label: 'Expiration Alerts', icon: <TimerOff className="h-4 w-4" /> }
      ]
    },
    { 
      id: 'budget', 
      label: 'Budget', 
      icon: <Wallet className="h-5 w-5" />,
      subItems: [
        { id: 'budget-monthly', label: 'Monthly Budget', icon: <DollarSign className="h-4 w-4" /> },
        { id: 'budget-bills', label: 'Bill Tracker', icon: <Clock className="h-4 w-4" /> },
        { id: 'budget-savings', label: 'Savings Goals', icon: <PiggyBank className="h-4 w-4" /> },
        { id: 'budget-expenses', label: 'Expense Logs', icon: <BookOpen className="h-4 w-4" /> },
        { id: 'budget-investments', label: 'Investment Portfolio', icon: <LineChart className="h-4 w-4" /> }
      ] 
    },
    { 
      id: 'celebrations', 
      label: 'Celebrations', 
      icon: <Award className="h-5 w-5" />,
      subItems: [
        { id: 'celebrations-birthdays', label: 'Birthdays', icon: <Cake className="h-4 w-4" /> },
        { id: 'celebrations-holidays', label: 'Holiday Planning', icon: <Calendar className="h-4 w-4" /> },
        { id: 'celebrations-anniversaries', label: 'Anniversaries', icon: <Award className="h-4 w-4" /> },
        { id: 'celebrations-parties', label: 'Party Ideas', icon: <PartyPopper className="h-4 w-4" /> },
        { id: 'celebrations-gifts', label: 'Gift Planning', icon: <Gift className="h-4 w-4" /> }
      ]
    },
    { id: 'assistant', label: 'AI Assistant', icon: <MessageSquareMore className="h-5 w-5" /> }
  ];

  // State to track which items are currently visible in the main navigation
  const [visibleNavItems, setVisibleNavItems] = useState<string[]>(() => {
    // Start with fixed items
    const fixedIds = navItems.filter(item => item.fixed).map(item => item.id);
    // Add default visible items
    const defaultVisibleIds = navItems.filter(item => !item.fixed && item.defaultVisible).map(item => item.id);
    return [...fixedIds, ...defaultVisibleIds];
  });

  // Get fixed items (always visible)
  const fixedItems = navItems.filter(item => item.fixed);

  // Get non-fixed items that are currently visible in the main navigation
  const nonFixedVisibleItems = navItems.filter(
    item => !item.fixed && visibleNavItems.includes(item.id)
  );

  // Get items that should be in the "More" dropdown (not fixed and not currently visible)
  const moreItems = navItems.filter(
    item => !item.fixed && !visibleNavItems.includes(item.id)
  );

  // Function to swap a visible item with a "More" item
  const swapNavItem = (moreItemId: string) => {
    // Find the "More" item we want to make visible
    const moreItem = navItems.find(item => item.id === moreItemId);
    if (!moreItem || moreItem.fixed) return;

    // Choose which item to replace - we'll take the first non-fixed visible item
    // that isn't currently active (if possible)
    let itemToReplaceId = nonFixedVisibleItems[0]?.id;
    
    // Try to find a non-active item to replace first
    const nonActiveVisibleItems = nonFixedVisibleItems.filter(
      item => item.id !== activeParentNavItem
    );
    
    if (nonActiveVisibleItems.length > 0) {
      itemToReplaceId = nonActiveVisibleItems[0].id;
    }
    
    if (!itemToReplaceId) return;

    // Update the visible items list
    setVisibleNavItems(prev => {
      const newItems = [...prev];
      const indexToReplace = newItems.indexOf(itemToReplaceId);
      newItems[indexToReplace] = moreItemId;
      return newItems;
    });
  };

  // Update time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    
    updateTime(); // Initial call
    
    const timeInterval = setInterval(updateTime, 60000);
    return () => clearInterval(timeInterval);
  }, []);
  
  const toggleMobileSearch = () => {
    setShowMobileSearch(prev => !prev);
  };

  const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();

  // Get the parent nav item from an active ID (which might be a sub-item)
  const getParentNavItem = (activeId: string): string => {
    // If it's a main nav item, return as is
    if (navItems.some(item => item.id === activeId)) {
      return activeId;
    }
    
    // Otherwise, it's a sub-item, extract the parent ID
    const parts = activeId.split('-');
    return parts[0]; // The parent ID is always the first part
  };

  // Get the active parent nav item
  const activeParentNavItem = getParentNavItem(activeNavItem);

  // Find the current active nav item to get its subcategories
  const currentActiveNavItem = navItems.find(item => item.id === activeParentNavItem);
  
  // Function to handle item selection from More dropdown
  const handleMoreItemSelect = (itemId: string) => {
    // Set the clicked item as active
    setActiveNavItem(itemId);
    // Swap the item with one of the visible non-fixed items
    swapNavItem(itemId);
    // Close the dropdown
    setMoreDropdownOpen(false);
    // Blur the More button to remove focus
    if (moreButtonRef.current) {
      moreButtonRef.current.blur();
    }
  };
  
  // Render navigation item
  const renderNavItem = (item: NavItem) => {
    return (
      <Button 
        key={item.id}
        variant="ghost" 
        size="sm" 
        className={cn(
          "flex items-center gap-1.5 rounded-none border-b-2 px-4 py-3 text-base font-medium transition-colors touch-manipulation nav-item flex-1",
          activeParentNavItem === item.id 
            ? "border-primary text-foreground" 
            : "border-transparent text-muted-foreground hover:text-foreground"
        )}
        onClick={() => {
          setActiveNavItem(item.id);
        }}
      >
        {item.icon}
        <span className="text-sm">{item.label}</span>
        {item.subItems && item.subItems.length > 0 && (
          <ChevronDown className="h-3.5 w-3.5 ml-1" />
        )}
      </Button>
    );
  };

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container flex h-20 items-center px-4 border-b border-border/40">
        {/* Left: Logo and Menu Button */}
        <div className="flex items-center gap-3 md:gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden h-12 w-12 touch-manipulation"
            onClick={onMenuToggle}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="hidden font-bold text-2xl md:inline-flex">Family Hub</span>
            <span className="font-bold text-2xl md:hidden">FH</span>
          </div>
        </div>
        
        {/* Center: Search or Page Title */}
        <div className="flex-1 flex justify-center">
          {showSearch ? (
            <>
              {/* Desktop Search */}
              <div className="hidden md:flex w-full relative px-4 max-w-xl">
                <Search className="absolute left-7 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search everything..."
                  className="w-full h-11 pl-10 bg-muted/50"
                />
              </div>
              
              {/* Mobile Search Button */}
              {!showMobileSearch && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden h-12 w-12 touch-manipulation"
                  onClick={toggleMobileSearch}
                >
                  <Search className="h-6 w-6" />
                  <span className="sr-only">Search</span>
                </Button>
              )}
            </>
          ) : pageTitle ? (
            <h1 className="text-xl font-semibold">{pageTitle}</h1>
          ) : null}
        </div>
        
        {/* Right: Weather, Time, Actions, User */}
        <div className="flex items-center">
          {/* Weather Widget */}
          <div className="hidden md:flex items-center mr-3 px-3 py-1.5 bg-accent/30 rounded-full">
            {weatherData.icon}
            <div className="ml-2 flex items-center">
              <span className="text-sm font-medium">{weatherData.temp}°</span>
              <Thermometer className="h-3 w-3 mx-1 text-muted-foreground" />
              <span className="text-xs text-muted-foreground hidden lg:inline ml-1">{weatherData.location}</span>
            </div>
          </div>
          
          {/* Time Display */}
          <div className="hidden md:flex items-center mr-3">
            <span className="text-sm font-medium">{currentTime}</span>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex h-12 w-12 touch-manipulation"
          >
            <Bell className="h-6 w-6" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-12 w-12 rounded-full touch-manipulation">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userAvatar} alt={userName} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal p-4">
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-medium leading-none">{userName}</p>
                  <p className="text-sm leading-none text-muted-foreground">
                    family@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="h-11 cursor-pointer focus:bg-accent">
                <User className="mr-3 h-5 w-5" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="h-11 cursor-pointer focus:bg-accent">
                <Settings className="mr-3 h-5 w-5" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="h-11 cursor-pointer focus:bg-accent">Family Settings</DropdownMenuItem>
              <DropdownMenuItem className="h-11 cursor-pointer focus:bg-accent">Calendar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="h-11 cursor-pointer focus:bg-accent">Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Main Navigation Menu */}
      <div className="hidden md:block border-b border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container">
          <nav className="flex items-center justify-between overflow-x-auto hide-scrollbar">
            {/* Fixed Items (Always Visible) */}
            {fixedItems.map(renderNavItem)}
            
            {/* Non-Fixed but Currently Visible Items */}
            {nonFixedVisibleItems.map(renderNavItem)}
            
            {/* More Dropdown (for remaining items) */}
            {moreItems.length > 0 && (
              <DropdownMenu open={moreDropdownOpen} onOpenChange={setMoreDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button 
                    ref={moreButtonRef}
                    variant="ghost" 
                    size="sm" 
                    className={cn(
                      "flex items-center gap-1.5 rounded-none border-b-2 px-4 py-3 text-base font-medium transition-colors touch-manipulation flex-1",
                      // Only show as active if we're not on a main nav item or we're specifically on 'more'
                      !navItems.some(item => item.id === activeParentNavItem) || activeParentNavItem === 'more'
                        ? "border-primary" 
                        : "border-transparent"
                    )}
                  >
                    <span className="text-sm">More</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {moreItems.map(item => (
                    <DropdownMenuItem 
                      key={item.id}
                      className={cn(
                        "h-10 cursor-pointer",
                        activeParentNavItem === item.id ? "bg-accent/50 text-foreground" : ""
                      )}
                      onClick={() => handleMoreItemSelect(item.id)}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>
      </div>

      {/* Subcategories row (appears when a main category with subcategories is active) */}
      {currentActiveNavItem?.subItems && currentActiveNavItem.subItems.length > 0 && (
        <div className="hidden md:block border-b border-border/30 bg-accent/10 backdrop-blur-sm">
          <div className="container">
            <div className="flex items-center justify-start overflow-x-auto hide-scrollbar py-1">
              {currentActiveNavItem.subItems.map(subItem => (
                <Button 
                  key={subItem.id}
                  variant="ghost" 
                  size="sm" 
                  className={cn(
                    "h-9 px-3 py-1 text-xs font-medium rounded-md mx-0.5 first:ml-0",
                    activeNavItem === subItem.id 
                      ? "bg-accent/50 text-foreground" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                  )}
                  onClick={() => setActiveNavItem(subItem.id)}
                >
                  <div className="flex items-center gap-1.5">
                    {subItem.icon}
                    <span>{subItem.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="md:hidden border-t border-border/40 p-3 bg-background">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search everything..."
              className="w-full h-12 pl-10 pr-12 bg-muted/50 text-base"
              autoFocus
            />
            <Button 
              variant="ghost" 
              className="absolute right-1 top-1 h-10 w-10 p-0 touch-manipulation"
              onClick={toggleMobileSearch}
            >
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>
      )}
      
      {/* Mobile Weather & Time Bar */}
      <div className="flex md:hidden items-center justify-between px-4 py-2 bg-accent/20 border-b border-border/40">
        <div className="flex items-center">
          {weatherData.icon}
          <span className="ml-1 text-sm font-medium">{weatherData.temp}°</span>
          <span className="ml-1 text-xs text-muted-foreground">{weatherData.condition}</span>
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium">{currentTime}</span>
        </div>
      </div>
      
      {/* Mobile subcategories (if a parent item is active) */}
      {currentActiveNavItem?.subItems && currentActiveNavItem.subItems.length > 0 && (
        <div className="md:hidden px-2 py-2 bg-background/90 border-b border-border/40 overflow-x-auto hide-scrollbar">
          <div className="flex gap-1.5">
            {currentActiveNavItem.subItems.map(subItem => (
              <Button 
                key={subItem.id}
                variant="ghost" 
                size="sm" 
                className={cn(
                  "h-8 px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap",
                  activeNavItem === subItem.id 
                    ? "bg-accent/50 text-foreground" 
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/30"
                )}
                onClick={() => setActiveNavItem(subItem.id)}
              >
                <div className="flex items-center gap-1">
                  {subItem.icon}
                  <span className="text-xs">{subItem.label}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}