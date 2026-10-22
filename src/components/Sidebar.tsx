import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight,
  CircleDot,
  Calendar,
  BookOpen,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  Heart,
  Sun,
  Moon,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  X,
  RefreshCw,
  FileText,
  MessageSquare,
  ShoppingCart,
  Camera,
  Bell,
  Award,
  User
} from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { format, isToday, isYesterday, subDays, formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/components/ThemeProvider';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

// Define family member status types
type FamilyMemberStatus = 'home' | 'away' | 'school' | 'work' | 'traveling' | 'unknown';
type ActivityStatus = 'active' | 'idle' | 'offline';
type TransportMode = 'driving' | 'walking' | 'transit' | 'cycling' | 'none';
type MoodStatus = 'happy' | 'neutral' | 'upset' | 'sick' | 'unknown';

// Activity type enumerations
type ActivityType = 'task' | 'event' | 'message' | 'location' | 'status' | 'shopping' | 'health' | 'photo' | 'achievement';
type ActivityPriority = 'high' | 'medium' | 'low';

// Family member data structure
interface FamilyMember {
  id: string;
  name: string;
  avatar?: string;
  initials: string;
  status: FamilyMemberStatus;
  activityStatus: ActivityStatus;
  lastActivity: string;
  location: string;
  batteryLevel: number;
  transportMode: TransportMode;
  recentlyCompleted?: string;
  eta?: string;
  mood?: MoodStatus;
  healthStatus?: string;
  color: string;
  bgColor: string;
  connectionStrength?: number;
}

// Event interface
interface Event {
  id: string;
  title: string;
  time: string;
  type: 'meeting' | 'task' | 'reminder' | 'appointment';
  icon: React.ReactNode;
  color: string;
  participants?: string[];
}

// Enhanced Activity Log Entry
interface ActivityLogEntry {
  id: string;
  user: {
    id: string;
    name: string;
    initials: string;
    color: string;
    bgColor: string;
  };
  action: string;
  time: string;
  timestamp: Date;
  type: ActivityType;
  icon?: React.ReactNode;
  priority?: ActivityPriority;
  details?: string;
  relatedItemId?: string;
  read: boolean;
}

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({
  className,
  isOpen = false,
  onToggle,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [, setCurrentTime] = useState(format(new Date(), 'h:mm a'));
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('status');
  const [activityViewMode, setActivityViewMode] = useState<'all' | 'grouped'>('all');
  const [activityFilterUser, setActivityFilterUser] = useState<string | 'all'>('all');
  const [activitySortOrder, setActivitySortOrder] = useState<'newest' | 'oldest'>('newest');
  const [, setActivityFilterType] = useState<ActivityType | 'all'>('all');
  const [activityTypeFilters, setActivityTypeFilters] = useState<{
    [key in ActivityType]: boolean;
  }>({
    task: true,
    event: true,
    message: true,
    location: true,
    status: true,
    shopping: true,
    health: true,
    photo: true,
    achievement: true,
  });
  const [activityShowUnread, setActivityShowUnread] = useState<boolean>(false);
  const [visibleActivities, setVisibleActivities] = useState<number>(5);
  const { theme, setTheme } = useTheme();
  
  // Scroll state
  const contentRef = useRef<HTMLDivElement>(null);
  const [, setScrollPosition] = useState(0);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  
  // Check scroll possibility
  const checkScrollPossibility = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      setScrollPosition(scrollTop);
      setCanScrollUp(scrollTop > 0);
      setCanScrollDown(scrollTop < scrollHeight - clientHeight - 5); // 5px buffer
    }
  };
  
  // Handle scroll navigation
  const handleScroll = (direction: 'up' | 'down') => {
    if (contentRef.current) {
      const scrollAmount = 200; // Amount to scroll each time
      const currentScroll = contentRef.current.scrollTop;
      const targetScroll = direction === 'up' 
        ? Math.max(0, currentScroll - scrollAmount)
        : currentScroll + scrollAmount;
      
      contentRef.current.scrollTo({
        top: targetScroll,
        behavior: 'smooth'
      });
    }
  };
  
  // Listen for scroll events
  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      content.addEventListener('scroll', checkScrollPossibility);
      // Initial check
      checkScrollPossibility();
    }
    
    return () => {
      if (content) {
        content.removeEventListener('scroll', checkScrollPossibility);
      }
    };
  }, [activeSection]);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), 'h:mm a'));
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Mock data for user profile section
  const userData = {
    name: "Jane Smith",
    pendingTasks: 5,
    totalTasks: 8
  };
  
  // Mock data for family members
  const familyMembers: FamilyMember[] = [
    {
      id: 'dad',
      name: 'John Dad',
      initials: 'JD',
      status: 'home',
      activityStatus: 'active',
      lastActivity: 'Working in home office',
      location: 'Home Office',
      batteryLevel: 85,
      transportMode: 'none',
      mood: 'happy',
      healthStatus: 'Normal',
      recentlyCompleted: 'Finished work meeting',
      connectionStrength: 95,
      color: 'text-blue-300',
      bgColor: 'bg-blue-500/20'
    },
    {
      id: 'mom',
      name: 'Sarah Mom',
      initials: 'SM',
      status: 'home',
      activityStatus: 'active',
      lastActivity: 'Cooking dinner',
      location: 'Kitchen',
      batteryLevel: 65,
      transportMode: 'none',
      mood: 'happy',
      healthStatus: 'Normal',
      recentlyCompleted: 'Grocery shopping',
      connectionStrength: 88,
      color: 'text-green-300',
      bgColor: 'bg-green-500/20'
    },
    {
      id: 'tim',
      name: 'Tim Junior',
      initials: 'TJ',
      status: 'home',
      activityStatus: 'idle',
      lastActivity: 'Playing video games',
      location: 'Bedroom',
      batteryLevel: 42,
      transportMode: 'none',
      mood: 'neutral',
      healthStatus: 'Normal',
      recentlyCompleted: 'Homework',
      connectionStrength: 75,
      color: 'text-purple-300',
      bgColor: 'bg-purple-500/20'
    },
    {
      id: 'lisa',
      name: 'Lisa Junior',
      initials: 'LJ',
      status: 'away',
      activityStatus: 'active',
      lastActivity: 'At soccer practice',
      location: 'Sports Center',
      batteryLevel: 78,
      transportMode: 'driving',
      mood: 'happy',
      healthStatus: 'Normal',
      eta: '15 min',
      connectionStrength: 82,
      color: 'text-red-300',
      bgColor: 'bg-red-500/20'
    }
  ];
  
  // Mock events for today
  const todayEvents: Event[] = [
    {
      id: '1',
      title: 'Team Meeting',
      time: '10:00 AM - 11:00 AM',
      type: 'meeting',
      icon: <Calendar className="w-5 h-5 text-blue-400" />,
      color: 'text-blue-300',
      participants: ['John', 'Sarah']
    },
    {
      id: '2',
      title: 'Science Project',
      time: 'Due Today',
      type: 'task',
      icon: <BookOpen className="w-5 h-5 text-green-400" />,
      color: 'text-green-300',
      participants: ['Tim']
    },
    {
      id: '3',
      title: 'Soccer Practice',
      time: '4:00 PM - 5:30 PM',
      type: 'appointment',
      icon: <Calendar className="w-5 h-5 text-purple-400" />,
      color: 'text-purple-300',
      participants: ['Lisa']
    }
  ];
  
  // Mock deadlines
  const deadlines = [
    {
      id: '1',
      title: 'Pay Electricity Bill',
      dueDate: 'Due Tomorrow',
      urgent: true,
      assignedTo: ['John', 'Sarah']
    },
    {
      id: '2',
      title: 'Book Dentist Appointment',
      dueDate: 'Due in 3 days',
      urgent: false,
      assignedTo: ['Sarah']
    }
  ];
  
  // Enhanced mock activity log with dates and more details
  const getActivityIcon = (type: ActivityType): React.ReactNode => {
    switch (type) {
      case 'task': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'event': return <Calendar className="w-4 h-4 text-purple-400" />;
      case 'message': return <MessageSquare className="w-4 h-4 text-green-400" />;
      case 'location': return <MapPin className="w-4 h-4 text-amber-400" />;
      case 'status': return <RefreshCw className="w-4 h-4 text-neutral-400" />;
      case 'shopping': return <ShoppingCart className="w-4 h-4 text-pink-400" />;
      case 'health': return <Heart className="w-4 h-4 text-red-400" />;
      case 'photo': return <Camera className="w-4 h-4 text-indigo-400" />;
      case 'achievement': return <Award className="w-4 h-4 text-yellow-400" />;
      default: return <FileText className="w-4 h-4 text-blue-400" />;
    }
  };
  
  // Extended activity log with more entries and detailed data
  const generateActivityLog = (): ActivityLogEntry[] => {
    const now = new Date();
    
    
    const baseActivities: Partial<ActivityLogEntry>[] = [
      {
        user: {
          id: 'dad',
          name: 'John',
          initials: 'JD',
          color: 'text-blue-300',
          bgColor: 'bg-blue-500/20'
        },
        action: 'added a new task',
        type: 'task',
        details: 'Pay utility bills by Friday',
        priority: 'high',
        read: true
      },
      {
        user: {
          id: 'mom',
          name: 'Sarah',
          initials: 'SM',
          color: 'text-green-300',
          bgColor: 'bg-green-500/20'
        },
        action: 'finished shopping',
        type: 'shopping',
        details: 'Bought groceries for the week: milk, eggs, bread, vegetables',
        priority: 'medium',
        read: false
      },
      {
        user: {
          id: 'tim',
          name: 'Tim',
          initials: 'TJ',
          color: 'text-purple-300',
          bgColor: 'bg-purple-500/20'
        },
        action: 'completed homework',
        type: 'task',
        details: 'Math assignment on fractions',
        priority: 'medium',
        read: true
      },
      {
        user: {
          id: 'lisa',
          name: 'Lisa',
          initials: 'LJ',
          color: 'text-red-300',
          bgColor: 'bg-red-500/20'
        },
        action: 'arrived at soccer practice',
        type: 'location',
        details: 'At Sports Center until 5:30 PM',
        priority: 'low',
        read: true
      },
      {
        user: {
          id: 'dad',
          name: 'John',
          initials: 'JD',
          color: 'text-blue-300',
          bgColor: 'bg-blue-500/20'
        },
        action: 'scheduled a family dinner',
        type: 'event',
        details: 'Friday at 7:00 PM - Pasta night',
        priority: 'medium',
        read: false
      },
      {
        user: {
          id: 'mom',
          name: 'Sarah',
          initials: 'SM',
          color: 'text-green-300',
          bgColor: 'bg-green-500/20'
        },
        action: 'sent a message',
        type: 'message',
        details: 'Don\'t forget to pick up Tim from soccer practice today',
        priority: 'high',
        read: false
      },
      {
        user: {
          id: 'tim',
          name: 'Tim',
          initials: 'TJ',
          color: 'text-purple-300',
          bgColor: 'bg-purple-500/20'
        },
        action: 'updated health status',
        type: 'health',
        details: 'Feeling better today, fever down to normal',
        priority: 'medium',
        read: true
      },
      {
        user: {
          id: 'lisa',
          name: 'Lisa',
          initials: 'LJ',
          color: 'text-red-300',
          bgColor: 'bg-red-500/20'
        },
        action: 'shared a photo',
        type: 'photo',
        details: 'Team photo from soccer championship',
        priority: 'low',
        read: true
      },
      {
        user: {
          id: 'dad',
          name: 'John',
          initials: 'JD',
          color: 'text-blue-300',
          bgColor: 'bg-blue-500/20'
        },
        action: 'created a shopping list',
        type: 'shopping',
        details: 'Weekend BBQ supplies needed',
        priority: 'medium',
        read: true
      },
      {
        user: {
          id: 'mom',
          name: 'Sarah',
          initials: 'SM',
          color: 'text-green-300',
          bgColor: 'bg-green-500/20'
        },
        action: 'earned an achievement',
        type: 'achievement',
        details: 'Completed all tasks for the week',
        priority: 'low',
        read: false
      },
      {
        user: {
          id: 'tim',
          name: 'Tim',
          initials: 'TJ',
          color: 'text-purple-300',
          bgColor: 'bg-purple-500/20'
        },
        action: 'changed status',
        type: 'status',
        details: 'Now studying for math test',
        priority: 'low',
        read: true
      },
      {
        user: {
          id: 'lisa',
          name: 'Lisa',
          initials: 'LJ',
          color: 'text-red-300',
          bgColor: 'bg-red-500/20'
        },
        action: 'added an event',
        type: 'event',
        details: 'Science fair next Tuesday',
        priority: 'medium',
        read: false
      },
      {
        user: {
          id: 'dad',
          name: 'John',
          initials: 'JD',
          color: 'text-blue-300',
          bgColor: 'bg-blue-500/20'
        },
        action: 'needs to approve field trip',
        type: 'task',
        details: 'Permission slip for museum visit next week',
        priority: 'high',
        read: false
      },
      {
        user: {
          id: 'mom',
          name: 'Sarah',
          initials: 'SM',
          color: 'text-green-300',
          bgColor: 'bg-green-500/20'
        },
        action: 'checked in at',
        type: 'location',
        details: 'Grocery store on Main St',
        priority: 'low',
        read: true
      },
      {
        user: {
          id: 'tim',
          name: 'Tim',
          initials: 'TJ',
          color: 'text-purple-300',
          bgColor: 'bg-purple-500/20'
        },
        action: 'received a message',
        type: 'message',
        details: 'From Math Teacher: Great progress on the latest test',
        priority: 'medium',
        read: false
      }
    ];
    
    // Create activities with timestamps across different days
    return baseActivities.map((activity, index) => {
      // Distribute timestamps across the last 3 days
      let timestamp: Date;
      if (index < 5) {
        timestamp = new Date(); // Today
      } else if (index < 10) {
        timestamp = subDays(now, 1); // Yesterday
      } else {
        timestamp = subDays(now, 2); // Day before yesterday
      }
      
      // Add some hour variation
      timestamp.setHours(
        Math.floor(Math.random() * 12) + 8, // 8 AM to 8 PM
        Math.floor(Math.random() * 60)
      );
      
      return {
        id: `activity-${index + 1}`,
        time: formatDistanceToNow(timestamp, { addSuffix: true }),
        timestamp,
        icon: getActivityIcon(activity.type as ActivityType),
        ...activity
      } as ActivityLogEntry;
    });
  };
  
  const activityLog = generateActivityLog();
  
  // For desktop view, allow collapsing the sidebar
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  
  // Handle family member selection
  const handleMemberSelect = (memberId: string) => {
    if (selectedMember === memberId) {
      setSelectedMember(null);
      setShowMemberDetails(false);
    } else {
      setSelectedMember(memberId);
      setShowMemberDetails(true);
    }
  };
  
  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  // Reset activity filters
  const resetActivityFilters = () => {
    setActivityFilterUser('all');
    setActivitySortOrder('newest');
    setActivityFilterType('all');
    setActivityTypeFilters({
      task: true,
      event: true,
      message: true,
      location: true,
      status: true,
      shopping: true,
      health: true,
      photo: true,
      achievement: true
    });
    setActivityShowUnread(false);
  };
  
  // Load more activities
  const loadMoreActivities = () => {
    setVisibleActivities(prev => prev + 5);
  };
  
  // Mark activity as read
  const markActivityAsRead = (id: string) => {
    // In a real app, this would update the activity in a database
    console.log(`Marking activity ${id} as read`);
  };
  
  // Toggle activity type filter
  const toggleActivityTypeFilter = (type: ActivityType) => {
    setActivityTypeFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  // Apply filters to activity log
  const getFilteredActivities = () => {
    return activityLog
      .filter(activity => {
        // Filter by user
        if (activityFilterUser !== 'all' && activity.user.id !== activityFilterUser) {
          return false;
        }
        
        // Filter by type
        if (!activityTypeFilters[activity.type]) {
          return false;
        }
        
        // Filter by read status
        if (activityShowUnread && activity.read) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sort by time
        if (activitySortOrder === 'newest') {
          return b.timestamp.getTime() - a.timestamp.getTime();
        } else {
          return a.timestamp.getTime() - b.timestamp.getTime();
        }
      })
      .slice(0, visibleActivities);
  };
  
  // Group activities by date
  const groupActivitiesByDate = (activities: ActivityLogEntry[]) => {
    const groups: { [key: string]: ActivityLogEntry[] } = {};
    
    activities.forEach(activity => {
      let dateKey: string;
      
      if (isToday(activity.timestamp)) {
        dateKey = 'Today';
      } else if (isYesterday(activity.timestamp)) {
        dateKey = 'Yesterday';
      } else {
        dateKey = format(activity.timestamp, 'EEEE, MMMM d');
      }
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(activity);
    });
    
    return groups;
  };
  
  // Get priority indicator
  const getPriorityIndicator = (priority?: ActivityPriority) => {
    if (!priority) return null;
    
    switch (priority) {
      case 'high':
        return <span className="h-2 w-2 bg-red-500 rounded-full"></span>;
      case 'medium':
        return <span className="h-2 w-2 bg-amber-500 rounded-full"></span>;
      case 'low':
        return <span className="h-2 w-2 bg-green-500 rounded-full"></span>;
      default:
        return null;
    }
  };
  
  // Get the title case for activity types
  const getActivityTypeLabel = (type: ActivityType | 'all'): string => {
    if (type === 'all') return 'All Types';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };
  
  // Filtered activities
  const filteredActivities = getFilteredActivities();
  const groupedActivities = groupActivitiesByDate(filteredActivities);
  
  // Activity filter counts
  const activityCounts = {
    all: activityLog.length,
    unread: activityLog.filter(a => !a.read).length,
  };
  
  const activeTypeCount = Object.values(activityTypeFilters).filter(Boolean).length;
  const isFiltering = activityFilterUser !== 'all' || activeTypeCount < 9 || activityShowUnread;

  return (
    <>
      {/* Mobile overlay when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out",
          isOpen ? "translate-x-0 shadow-lg shadow-black/10" : "-translate-x-full md:translate-x-0",
          collapsed ? "md:w-16" : "md:w-64",
          "border-r border-border/40 bg-sidebar backdrop-blur supports-[backdrop-filter]:bg-sidebar/80",
          "sidebar-animation relative",
          className
        )}
      >
        <div className="flex h-full flex-col overflow-hidden">
          {/* Sidebar header */}
          <div className="flex h-16 items-center justify-between border-b border-border/40 px-3">
            {/* User profile in header area (when not collapsed) */}
            {!collapsed ? (
              <div className="flex items-center justify-between w-full sidebar-item">
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-none">{userData.name}</span>
                  <span className="text-xs text-muted-foreground">Family Admin</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-3 w-3 text-amber-400" />
                  ) : (
                    <Moon className="h-3 w-3 text-blue-400" />
                  )}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-medium">FH</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={toggleTheme}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-3 w-3 text-amber-400" />
                  ) : (
                    <Moon className="h-3 w-3 text-blue-400" />
                  )}
                </Button>
              </div>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hidden md:flex transition-transform hover:bg-accent/60", 
                collapsed ? "rotate-0" : "rotate-180",
                "sidebar-toggle-button"
              )}
              onClick={toggleCollapsed}
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5 md:hidden" />
              )}
              <span className="sr-only">
                {collapsed ? "Expand sidebar" : "Collapse sidebar"}
              </span>
            </Button>
          </div>
          
          {/* Navigation tabs (only shown when expanded) */}
          {!collapsed && (
            <div className="px-3 py-2 border-b border-border/40">
              <div className="flex space-x-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={cn(
                    "px-2 py-1 h-auto text-xs rounded",
                    activeSection === 'status' ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                  onClick={() => setActiveSection('status')}
                >
                  Status
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={cn(
                    "px-2 py-1 h-auto text-xs rounded",
                    activeSection === 'events' ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                  onClick={() => setActiveSection('events')}
                >
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  Events
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={cn(
                    "px-2 py-1 h-auto text-xs rounded",
                    activeSection === 'activity' ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                  )}
                  onClick={() => setActiveSection('activity')}
                >
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  Activity
                </Button>
              </div>
            </div>
          )}
          
          {/* Up scroll button */}
          {canScrollUp && !collapsed && (
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute top-[80px] right-2 z-10 h-6 w-6 rounded-full bg-background/80 shadow-md hover:bg-accent/30 transition-opacity duration-200 opacity-80 hover:opacity-100"
              onClick={() => handleScroll('up')}
            >
              <ChevronUp className="h-4 w-4" />
              <span className="sr-only">Scroll up</span>
            </Button>
          )}
          
          {/* Main content with custom scroll */}
          <div 
            ref={contentRef}
            className={cn(
              "flex-1 py-2 px-3 overflow-y-auto custom-scroll-container compact-sidebar-content",
              showMemberDetails ? "pb-20" : "pb-2"
            )} 
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
            }}
          >            
            {/* Conditional content based on active section */}
            {activeSection === 'status' || collapsed ? (
              <>
                {/* Today's Highlights Section */}
                <div className="mb-4">
                  <div className="flex items-center mb-2 text-blue-400 sidebar-item">
                    <CircleDot className="w-4 h-4 mr-2 sidebar-item-icon" />
                    {!collapsed && <h3 className="text-xs font-medium uppercase">TODAY'S HIGHLIGHTS</h3>}
                  </div>
                  
                  {!collapsed ? (
                    <div className="rounded-lg bg-blue-900/20 border border-blue-500/20 p-2 sidebar-card hover:bg-blue-900/30 hover:border-blue-500/30 transition-colors">
                      {todayEvents.map((event) => (
                        <div key={event.id} className="flex items-start mb-2 last:mb-0">
                          <div className="p-1.5 bg-blue-500/10 rounded mr-2 sidebar-icon-container">
                            {event.icon}
                          </div>
                          <div>
                            <h4 className={`text-sm font-medium ${event.color} truncate-text`}>{event.title}</h4>
                            <p className={`text-xs ${event.color}/70`}>{event.time}</p>
                            {event.participants && (
                              <div className="flex items-center mt-0.5">
                                <span className="text-xs text-muted-foreground mr-1">For:</span>
                                {event.participants.map((participant, idx) => (
                                  <Badge key={idx} variant="outline" className="text-[10px] h-4 mr-1 last:mr-0">
                                    {participant}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <div className="sidebar-icon-container p-2 bg-blue-900/20 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-400" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Deadlines Section */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2 text-red-400 sidebar-item">
                    <div className="flex items-center">
                      <CircleDot className="w-4 h-4 mr-2 sidebar-item-icon" />
                      {!collapsed && <h3 className="text-xs font-medium uppercase">DEADLINES</h3>}
                    </div>
                    {!collapsed && <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">View All</a>}
                  </div>
                  
                  {!collapsed ? (
                    <>
                      {deadlines.map(deadline => (
                        <div 
                          key={deadline.id}
                          className="rounded-lg bg-red-900/20 border border-red-500/20 p-2 mb-2 sidebar-card hover:bg-red-900/30 hover:border-red-500/30 transition-colors"
                        >
                          <h4 className="text-sm font-medium text-white truncate-text">{deadline.title}</h4>
                          <p className="text-xs text-red-400">{deadline.dueDate}</p>
                          {deadline.assignedTo && (
                            <div className="flex items-center mt-0.5">
                              <span className="text-xs text-muted-foreground mr-1">Assigned to:</span>
                              {deadline.assignedTo.map((person, idx) => (
                                <Badge key={idx} variant="outline" className="text-[10px] h-4 mr-1 last:mr-0">
                                  {person}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="flex justify-center">
                      <div className="sidebar-icon-container p-2 bg-red-900/20 rounded-lg">
                        <Clock className="w-5 h-5 text-red-400" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Family Members List */}
                <div className="mb-4">
                  <div className="flex items-center mb-2 text-neutral-400 sidebar-item">
                    <CircleDot className="w-4 h-4 mr-2 sidebar-item-icon" />
                    {!collapsed && <h3 className="text-xs font-medium uppercase">FAMILY MEMBERS</h3>}
                  </div>
                  
                  {!collapsed ? (
                    <div className="space-y-2">
                      {/* Family Members */}
                      <div className="space-y-1.5">
                        {familyMembers.map(member => (
                          <div key={member.id} className="space-y-1">
                            {/* Member basic info row */}
                            <div 
                              className={cn(
                                "flex items-center justify-between p-1.5 rounded-lg transition-all duration-200",
                                "hover:bg-accent/30 cursor-pointer sidebar-item",
                                selectedMember === member.id ? "bg-accent/40" : "bg-accent/10"
                              )}
                              onClick={() => handleMemberSelect(member.id)}
                            >
                              <div className="flex items-center">
                                <span className="font-medium text-sm truncate-text max-w-[150px]">{member.name}</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-xs text-muted-foreground">{member.location}</span>
                              </div>
                            </div>
                            
                            {/* Expanded details */}
                            {selectedMember === member.id && showMemberDetails && (
                              <div className="ml-5 p-2 bg-accent/20 rounded-lg border-l-2 border-accent animate-fadeIn">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                                  <span>Last Activity:</span>
                                  <span className="text-foreground truncate-text max-w-[120px]">{member.lastActivity}</span>
                                </div>
                                
                                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                                  <span>Location:</span>
                                  <span className="text-foreground">
                                    {member.location}
                                  </span>
                                </div>
                                
                                {member.recentlyCompleted && (
                                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                                    <span>Completed:</span>
                                    <span className="text-foreground truncate-text max-w-[120px]">
                                      {member.recentlyCompleted}
                                    </span>
                                  </div>
                                )}
                                
                                {member.eta && (
                                  <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                                    <span>ETA Home:</span>
                                    <span className="text-foreground">
                                      {member.eta}
                                    </span>
                                  </div>
                                )}
                                
                                {/* Contact buttons */}
                                <div className="flex justify-end space-x-2 mt-2">
                                  <Button variant="outline" size="icon" className="h-7 w-7">
                                    <Phone className="h-3 w-3" />
                                  </Button>
                                  <Button variant="outline" size="icon" className="h-7 w-7">
                                    <MessageSquare className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <div className="sidebar-icon-container p-2 bg-neutral-800/50 rounded-lg">
                        <User className="w-5 h-5 text-neutral-400" />
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : activeSection === 'events' ? (
              <div className="space-y-3">
                <h3 className="text-xs font-medium mb-1.5">Upcoming Events</h3>
                {todayEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="p-2 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors"
                  >
                    <div className="flex items-center mb-1">
                      <div className="p-1 rounded bg-accent/20 mr-2">
                        {event.icon}
                      </div>
                      <h4 className="text-xs font-medium">{event.title}</h4>
                    </div>
                    <p className="text-xs text-muted-foreground ml-7">{event.time}</p>
                    {event.participants && (
                      <div className="flex items-center mt-1 ml-7">
                        <span className="text-xs text-muted-foreground mr-1">Participants:</span>
                        <div className="flex">
                          {event.participants.map((participant, idx) => (
                            <Badge key={idx} variant="outline" className="mr-1 text-xs">
                              {participant}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <h3 className="text-xs font-medium mt-3 mb-1.5">Upcoming Deadlines</h3>
                {deadlines.map((deadline) => (
                  <div 
                    key={deadline.id}
                    className="p-2 rounded-lg bg-red-900/20 hover:bg-red-900/30 transition-colors"
                  >
                    <h4 className="text-xs font-medium mb-0.5">{deadline.title}</h4>
                    <p className="text-xs text-red-400">{deadline.dueDate}</p>
                    {deadline.assignedTo && (
                      <div className="flex items-center mt-1">
                        <span className="text-xs text-muted-foreground mr-1">Assigned to:</span>
                        <div className="flex">
                          {deadline.assignedTo.map((person, idx) => (
                            <Badge key={idx} variant="outline" className="mr-1 text-xs">
                              {person}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {/* Activity Header with View Controls and Filters */}
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-medium">Activity Log</h3>
                  
                  <div className="flex items-center gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                          <SlidersHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel className="text-xs">Activity Filters</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="text-xs text-muted-foreground pb-1">Show Activities For</DropdownMenuLabel>
                          <div className="p-1">
                            <Select
                              value={activityFilterUser}
                              onValueChange={(value) => setActivityFilterUser(value)}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Select Family Member" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Family Members</SelectItem>
                                {familyMembers.map(member => (
                                  <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </DropdownMenuGroup>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="text-xs text-muted-foreground pb-1">Sort Order</DropdownMenuLabel>
                          <div className="p-1">
                            <Select
                              value={activitySortOrder}
                              onValueChange={(value) => setActivitySortOrder(value as 'newest' | 'oldest')}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </DropdownMenuGroup>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuGroup>
                          <DropdownMenuLabel className="text-xs text-muted-foreground pb-1">Activity Types</DropdownMenuLabel>
                          <div className="grid grid-cols-2 gap-1 p-1">
                            {(Object.keys(activityTypeFilters) as ActivityType[]).map(type => (
                              <div key={type} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`type-${type}`} 
                                  checked={activityTypeFilters[type]}
                                  onCheckedChange={() => toggleActivityTypeFilter(type)}
                                />
                                <label
                                  htmlFor={`type-${type}`}
                                  className="text-xs cursor-pointer"
                                >
                                  {getActivityTypeLabel(type)}
                                </label>
                              </div>
                            ))}
                          </div>
                        </DropdownMenuGroup>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuGroup>
                          <div className="flex items-center space-x-2 p-2">
                            <Checkbox 
                              id="unread-only" 
                              checked={activityShowUnread}
                              onCheckedChange={(checked) => setActivityShowUnread(!!checked)}
                            />
                            <label
                              htmlFor="unread-only"
                              className="text-xs cursor-pointer"
                            >
                              Show Unread Only
                            </label>
                          </div>
                        </DropdownMenuGroup>
                        
                        <DropdownMenuSeparator />
                        
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full justify-center h-8 text-xs flex items-center"
                          onClick={resetActivityFilters}
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Reset Filters
                        </Button>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={cn(
                        "h-7 w-7 text-muted-foreground hover:text-foreground",
                        activityViewMode === 'grouped' && "text-foreground bg-accent/50"
                      )}
                      onClick={() => setActivityViewMode(activityViewMode === 'all' ? 'grouped' : 'all')}
                    >
                      <Calendar className="h-4 w-4" />
                    </Button>
                    
                    {isFiltering && (
                      <Badge 
                        variant="outline" 
                        className="text-[10px] h-5 px-1.5 bg-accent/30 hover:bg-accent/50 cursor-pointer"
                        onClick={resetActivityFilters}
                      >
                        Filtered
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Activity counts */}
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-[10px] bg-muted/20">
                    All: {activityCounts.all}
                  </Badge>
                  {activityCounts.unread > 0 && (
                    <Badge className="text-[10px] bg-primary/20">
                      Unread: {activityCounts.unread}
                    </Badge>
                  )}
                </div>
                
                {/* Activity List - Grouped by Date View */}
                {activityViewMode === 'grouped' ? (
                  <div className="space-y-4">
                    {Object.entries(groupedActivities).map(([date, activities]) => (
                      <div key={date} className="space-y-1.5">
                        <h4 className="text-xs font-medium px-1 py-0.5 bg-accent/20 rounded">
                          {date}
                        </h4>
                        {activities.map((entry) => (
                          <TooltipProvider key={entry.id}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div 
                                  className={cn(
                                    "flex items-start p-2 rounded-lg transition-colors relative",
                                    !entry.read ? "bg-accent/20 hover:bg-accent/30" : "bg-accent/10 hover:bg-accent/20"
                                  )}
                                  onClick={() => markActivityAsRead(entry.id)}
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-1 mb-0.5">
                                      <span className="font-medium text-xs">{entry.user.name}</span>
                                      <span className="text-xs text-muted-foreground truncate-text">{entry.action}</span>
                                    </div>
                                    {entry.details && (
                                      <p className="text-xs text-muted-foreground truncate-text">{entry.details}</p>
                                    )}
                                    <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                                      <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                                      <span className="truncate-text">{entry.time}</span>
                                      {entry.icon && (
                                        <span className="ml-2 flex-shrink-0">{entry.icon}</span>
                                      )}
                                    </div>
                                  </div>
                                  {entry.priority && (
                                    <div className="absolute top-2 right-2">
                                      {getPriorityIndicator(entry.priority)}
                                    </div>
                                  )}
                                  {!entry.read && (
                                    <div className="absolute bottom-2 right-2">
                                      <span className="h-2 w-2 bg-blue-500 rounded-full block"></span>
                                    </div>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent side="right" className="max-w-xs">
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">{entry.user.name} {entry.action}</span>
                                    <Badge variant="outline" className="ml-2">
                                      {getActivityTypeLabel(entry.type)}
                                    </Badge>
                                  </div>
                                  {entry.details && (
                                    <p className="text-xs">{entry.details}</p>
                                  )}
                                  <p className="text-xs text-muted-foreground">
                                    {format(entry.timestamp, 'PPpp')}
                                  </p>
                                  {entry.priority && (
                                    <div className="flex items-center">
                                      <span className="text-xs text-muted-foreground mr-1">Priority:</span>
                                      <Badge variant="outline" className={cn(
                                        entry.priority === 'high' ? "text-red-400" : 
                                        entry.priority === 'medium' ? "text-amber-400" : "text-green-400"
                                      )}>
                                        {entry.priority.toUpperCase()}
                                      </Badge>
                                    </div>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                      </div>
                    ))}
                    
                    {/* Load more button */}
                    {visibleActivities < activityLog.length && (
                      <Button 
                        variant="ghost" 
                        className="w-full h-8 text-xs"
                        onClick={loadMoreActivities}
                      >
                        Load More
                      </Button>
                    )}
                  </div>
                ) : (
                  /* Activity List - Flat View */
                  <div className="space-y-1.5">
                    {filteredActivities.map((entry) => (
                      <TooltipProvider key={entry.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              className={cn(
                                "flex items-start p-2 rounded-lg transition-colors relative",
                                !entry.read ? "bg-accent/20 hover:bg-accent/30" : "bg-accent/10 hover:bg-accent/20"
                              )}
                              onClick={() => markActivityAsRead(entry.id)}
                            >
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                  <div className="flex items-center space-x-1">
                                    <span className="font-medium text-xs">{entry.user.name}</span>
                                    <span className="text-xs text-muted-foreground truncate-text">{entry.action}</span>
                                  </div>
                                  {entry.icon && (
                                    <span className="flex-shrink-0">{entry.icon}</span>
                                  )}
                                </div>
                                {entry.details && (
                                  <p className="text-xs text-muted-foreground truncate-text">{entry.details}</p>
                                )}
                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-0.5">
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                                    <span>{entry.time}</span>
                                  </div>
                                  <Badge 
                                    variant="outline" 
                                    className="text-[9px] h-4 px-1"
                                  >
                                    {getActivityTypeLabel(entry.type)}
                                  </Badge>
                                </div>
                              </div>
                              {entry.priority && (
                                <div className="absolute top-2 right-2">
                                  {getPriorityIndicator(entry.priority)}
                                </div>
                              )}
                              {!entry.read && (
                                <div className="absolute bottom-2 right-2">
                                  <span className="h-2 w-2 bg-blue-500 rounded-full block"></span>
                                </div>
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-xs">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">{entry.user.name} {entry.action}</span>
                                <Badge variant="outline" className="ml-2">
                                  {getActivityTypeLabel(entry.type)}
                                </Badge>
                              </div>
                              {entry.details && (
                                <p className="text-xs">{entry.details}</p>
                              )}
                              <p className="text-xs text-muted-foreground">
                                {format(entry.timestamp, 'PPpp')}
                              </p>
                              {entry.priority && (
                                <div className="flex items-center">
                                  <span className="text-xs text-muted-foreground mr-1">Priority:</span>
                                  <Badge variant="outline" className={cn(
                                    entry.priority === 'high' ? "text-red-400" : 
                                    entry.priority === 'medium' ? "text-amber-400" : "text-green-400"
                                  )}>
                                    {entry.priority.toUpperCase()}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                    
                    {/* Load more button */}
                    {visibleActivities < activityLog.length && (
                      <Button 
                        variant="ghost" 
                        className="w-full h-8 text-xs"
                        onClick={loadMoreActivities}
                      >
                        Load More
                      </Button>
                    )}
                  </div>
                )}
                
                {/* Empty state when no activities match filters */}
                {filteredActivities.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-4 text-center">
                    <Bell className="h-8 w-8 text-muted-foreground mb-2 opacity-40" />
                    <p className="text-xs text-muted-foreground">No activities match your filters</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 h-8 text-xs"
                      onClick={resetActivityFilters}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Reset Filters
                    </Button>
                  </div>
                )}
                
                <h3 className="text-xs font-medium mt-3 mb-1.5">Family Members</h3>
                <div className="space-y-1.5">
                  {familyMembers.map((member) => (
                    <div key={member.id} className="flex items-center p-1.5 rounded-lg bg-accent/10 hover:bg-accent/20 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-xs font-medium">{member.name}</span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground truncate-text max-w-[180px]">
                          {member.lastActivity}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Scroll hint indicators */}
            {!collapsed && canScrollDown && (
              <div className="scroll-hint-bottom opacity-50 mt-2 flex justify-center">
                <div className="animate-bounce">
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
          
          {/* Down scroll button */}
          {canScrollDown && !collapsed && (
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute bottom-16 right-2 z-10 h-6 w-6 rounded-full bg-background/80 shadow-md hover:bg-accent/30 transition-opacity duration-200 opacity-80 hover:opacity-100"
              onClick={() => handleScroll('down')}
            >
              <ChevronDown className="h-4 w-4" />
              <span className="sr-only">Scroll down</span>
            </Button>
          )}
          
          {/* Sidebar footer with collapse toggle for desktop */}
          <div className="mt-auto border-t border-border/40 p-3 hidden md:block">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-between hover:bg-accent/60",
                "transition-all duration-300 sidebar-toggle-button"
              )}
              onClick={toggleCollapsed}
            >
              {!collapsed && <span>Collapse</span>}
              {collapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
