"use client";

import { useState, useEffect, useRef } from "react";

// SVG Icon Components - encoding-safe, render perfectly everywhere
const Icon = ({ d, size = 16, color = "currentColor", strokeWidth = 2 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
    <path d={d} />
  </svg>
);
const IconUsers = (p) => <Icon {...p} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />;
const IconBook = (p) => <Icon {...p} d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 19.5A2.5 2.5 0 0 0 6.5 22H20V2H6.5A2.5 2.5 0 0 0 4 4.5v15z" />;
const IconGraduate = (p) => <svg width={p.size||16} height={p.size||16} viewBox="0 0 24 24" fill="none" stroke={p.color||"currentColor"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ display:"inline-block",verticalAlign:"middle",flexShrink:0 }}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>;
const IconBranch = (p) => <Icon {...p} d="M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9c0 2.21-1.79 6-5.25 9.6a.75.75 0 0 1-1.5 0C7.79 15 6 11.21 6 9" />;
const IconClipboard = (p) => <Icon {...p} d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1z" />;
const IconZap = (p) => <Icon {...p} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />;
const IconTrash = (p) => <Icon {...p} d="M3 6h18M19 6l-1 14H6L5 6M9 6V4h6v2M10 11v6M14 11v6" />;
const IconPlus = (p) => <Icon {...p} d="M12 5v14M5 12h14" />;
const IconEdit = (p) => <Icon {...p} d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />;
const IconSave = (p) => <Icon {...p} d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8" />;
const IconX = (p) => <Icon {...p} d="M18 6 6 18M6 6l12 12" />;
const IconExport = (p) => <Icon {...p} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />;
const IconSettings = (p) => <Icon {...p} d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />;
const IconShare = (p) => <Icon {...p} d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13" />;
const IconChevron = (p) => <Icon {...p} d="M6 9l6 6 6-6" />;

export default function Home() {
  // Session & UI States
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login"); // "login", "register"
  const [currentTab, setCurrentTab] = useState("student"); // "student", "pr", "admin"
  
  // Alert/Toast State
  const [toast, setToast] = useState(null);
  
  // Auth Form Inputs
  const [rollNumber, setRollNumber] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDegreeId, setSelectedDegreeId] = useState("");
  const [branch, setBranch] = useState("");
  const [batch, setBatch] = useState("2022-2027");
  const [adminPasscode, setAdminPasscode] = useState("");
  const [catalogLoading, setCatalogLoading] = useState(false);
  
  // Student Dashboard Data
  const [semesters, setSemesters] = useState([]);
  const [grades, setGrades] = useState([]);
  const [hasGrades, setHasGrades] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [openSemester, setOpenSemester] = useState(null);
  
  // Manual Import Form
  const [manualSem, setManualSem] = useState("1");
  const [manualHtml, setManualHtml] = useState("");
  const [showManualImport, setShowManualImport] = useState(false);

  // Scraper Modal States
  const [showScrapeModal, setShowScrapeModal] = useState(false);
  const [scrapeCaptchaImg, setScrapeCaptchaImg] = useState("");
  const [scrapeCookie, setScrapeCookie] = useState("");
  const [scrapePassword, setScrapePassword] = useState("");
  const [scrapeCaptchaCode, setScrapeCaptchaCode] = useState("");
  const [scrapeLoadingCaptcha, setScrapeLoadingCaptcha] = useState(false);
  const [scrapeSubmitting, setScrapeSubmitting] = useState(false);
  const [scrapeRollNumber, setScrapeRollNumber] = useState("");

  // PR Dashboard Data
  const [prStudents, setPrStudents] = useState([]);
  const [prScope, setPrScope] = useState({ branch: "", batch: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [backlogFilter, setBacklogFilter] = useState("all"); // "all", "backlog", "clear"
  const [selectedStudent, setSelectedStudent] = useState(null); // Drawer Student details
  const [selectedPRRolls, setSelectedPRRolls] = useState([]);
  const [selectedPRSemesters, setSelectedPRSemesters] = useState([]);
  
  // Admin Dashboard Data
  const [adminUsers, setAdminUsers] = useState([]);
  const [promotingUser, setPromotingUser] = useState(null); // User currently editing role
  const [promotedRole, setPromotedRole] = useState("STUDENT");
  const [promotedBranch, setPromotedBranch] = useState("");
  const [promotedBatch, setPromotedBatch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    rollNumber: "",
    name: "",
    password: "",
    role: "STUDENT",
    branch: "",
    batch: "",
    shareWithPR: false,
    prBranch: "",
    prBatch: "",
  });

  // Admin Curriculum Database States
  const [adminSubTab, setAdminSubTab] = useState("users"); // "users", "curriculum"
  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [curriculumBranchId, setCurriculumBranchId] = useState("");
  const [curriculumRegulationId, setCurriculumRegulationId] = useState("");
  const [syncingSyllabus, setSyncingSyllabus] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [editSubjectCode, setEditSubjectCode] = useState("");
  const [editSubjectTitle, setEditSubjectTitle] = useState("");
  const [editSubjectCredits, setEditSubjectCredits] = useState("");
  
  // Master Catalogs Lists
  const [degrees, setDegrees] = useState([]);
  const [branchesList, setBranchesList] = useState([]);
  const [regulations, setRegulations] = useState([]);
  
  // Manual Master Forms
  const [newDegreeName, setNewDegreeName] = useState("");
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchDegreeId, setNewBranchDegreeId] = useState("");
  const [newBranchDept, setNewBranchDept] = useState("");
  const [newRegCode, setNewRegCode] = useState("");

  // New Subject Form
  const [newSubjectCode, setNewSubjectCode] = useState("");
  const [newSubjectTitle, setNewSubjectTitle] = useState("");
  const [newSubjectCredits, setNewSubjectCredits] = useState("3");
  const [newSubjectBranchId, setNewSubjectBranchId] = useState("");
  const [newSubjectRegulationId, setNewSubjectRegulationId] = useState("");

  // What-If Planner States
  const [targetCgpa, setTargetCgpa] = useState("8.5");
  const [remainingCredits, setRemainingCredits] = useState("24");
  const [simulatedCourses, setSimulatedCourses] = useState([]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };
  
  // Load Session
  useEffect(() => {
    checkSession();
  }, []);

  // Fetch PR / Admin data when tabs switch
  useEffect(() => {
    if (!user) return;
    if (currentTab === "pr") {
      fetchPRStudents();
    } else if (currentTab === "admin") {
      fetchAdminUsers();
      if (adminSubTab === "curriculum") {
        fetchMasterCatalogs();
      }
    }
  }, [currentTab, adminSubTab, user]);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;
    if (currentTab === "admin" && adminSubTab === "curriculum" && curriculumBranchId && curriculumRegulationId) {
      fetchSubjects(curriculumBranchId, curriculumRegulationId);
    }
  }, [currentTab, adminSubTab, curriculumBranchId, curriculumRegulationId, user]);

  useEffect(() => {
    if (user || authMode !== "register" || degrees.length > 0 || catalogLoading) return;

    const fetchRegistrationCatalog = async () => {
      setCatalogLoading(true);
      try {
        const res = await fetch("/api/catalog");
        const data = await res.json();

        if (!res.ok) {
          showToast(data.error || "Unable to load degree and branch list", "error");
          return;
        }

        const nextDegrees = data.degrees || [];
        const nextBranches = data.branches || [];
        setDegrees(nextDegrees);
        setBranchesList(nextBranches);

        const firstDegree = nextDegrees[0];
        const firstBranch = firstDegree
          ? nextBranches.find(b => b.degreeId === firstDegree.id)
          : null;

        if (firstDegree) setSelectedDegreeId(firstDegree.id);
        if (firstBranch) setBranch(formatBranchName(firstBranch));
      } catch (err) {
        showToast("Network error loading degree and branch list", "error");
      } finally {
        setCatalogLoading(false);
      }
    };

    fetchRegistrationCatalog();
  }, [authMode, catalogLoading, degrees.length, user]);
  const checkSession = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.authenticated) {
        setUser(data.user);
        setSemesters(data.semesters || []);
        setHasGrades(data.hasGrades || false);
        if (data.user.role === "ADMIN") {
          setCurrentTab("admin");
        } else if (data.user.role === "PR") {
          setCurrentTab("pr");
        } else {
          setCurrentTab("student");
        }
        
        // Fetch detailed grades if they exist
        if (data.hasGrades) {
          fetchStudentGrades();
        }
      }
    } catch (err) {
      console.error("Session check error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        showToast("Logged in successfully!", "success");
        setRollNumber("");
        setPassword("");
        
        // Reload page data
        checkSession();
      } else {
        showToast(data.error || "Login failed", "error");
      }
    } catch (err) {
      showToast("Network error during login", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber,
          name,
          password,
          branch,
          batch,
          adminPasscode: adminPasscode || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        showToast("Registered successfully!", "success");
        setRollNumber("");
        setName("");
        setPassword("");
        setAdminPasscode("");
        
        // Reload page data
        checkSession();
      } else {
        showToast(data.error || "Registration failed", "error");
      }
    } catch (err) {
      showToast("Network error during registration", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setSemesters([]);
      setGrades([]);
      setHasGrades(false);
      showToast("Logged out successfully", "info");
    } catch (err) {
      showToast("Logout failed", "error");
    }
  };

  const fetchStudentGrades = async () => {
    try {
      const res = await fetch("/api/student/grades");
      const data = await res.json();
      if (res.ok) {
        setGrades(data.grades || []);
      }
    } catch (err) {
      console.error("Error fetching grades:", err);
    }
  };

  const fetchPRStudents = async (query = "") => {
    try {
      const url = query ? `/api/pr/students?search=${encodeURIComponent(query)}` : "/api/pr/students";
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setPrStudents(data.students || []);
        setPrScope(data.scope || { branch: "", batch: "" });
      } else {
        showToast(data.error || "Failed to load PR student details", "error");
      }
    } catch (err) {
      console.error("Error fetching PR roster:", err);
    }
  };

  const fetchAdminUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.ok) {
        setAdminUsers(data.users || []);
      } else {
        showToast(data.error || "Failed to load users list", "error");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const fetchMasterCatalogs = async () => {
    try {
      const [degRes, branchRes, regRes] = await Promise.all([
        fetch("/api/admin/degrees"),
        fetch("/api/admin/branches"),
        fetch("/api/admin/regulations")
      ]);
      const [degData, branchData, regData] = await Promise.all([degRes.json(), branchRes.json(), regRes.json()]);
      if (degRes.ok) setDegrees(degData.degrees || []);
      if (branchRes.ok) setBranchesList(branchData.branches || []);
      if (regRes.ok) setRegulations(regData.regulations || []);
    } catch (err) {
      showToast("Failed to load master catalogs", "error");
    }
  };

  const fetchSubjects = async (bId, rId) => {
    if (!bId || !rId) return;
    setSubjectsLoading(true);
    try {
      const res = await fetch(`/api/admin/subjects?branchId=${encodeURIComponent(bId)}&regulationId=${encodeURIComponent(rId)}`);
      const data = await res.json();
      if (res.ok) {
        setSubjects(data.subjects || []);
      } else {
        showToast(data.error || "Failed to fetch subjects", "error");
      }
    } catch (err) {
      showToast("Network error fetching subjects", "error");
    } finally {
      setSubjectsLoading(false);
    }
  };

  const handleSyncSyllabus = async () => {
    setSyncingSyllabus(true);
    try {
      const res = await fetch("/api/admin/subjects/parse-pdf", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || "Successfully synced subjects!", "success");
        await fetchMasterCatalogs();
        if (curriculumBranchId && curriculumRegulationId) {
          fetchSubjects(curriculumBranchId, curriculumRegulationId);
        }
      } else {
        showToast(data.error || "Sync failed", "error");
      }
    } catch (err) {
      showToast("Network error during syllabus sync", "error");
    } finally {
      setSyncingSyllabus(false);
    }
  };

  const handleAddDegree = async (e) => {
    e.preventDefault();
    if (!newDegreeName.trim()) return;
    try {
      const res = await fetch("/api/admin/degrees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newDegreeName.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Degree added!", "success");
        setNewDegreeName("");
        fetchMasterCatalogs();
      } else {
        showToast(data.error || "Failed to add degree", "error");
      }
    } catch (err) {
      showToast("Network error adding degree", "error");
    }
  };

  const handleDeleteDegree = async (id) => {
    if (!confirm("Delete this degree? All linked branches and subjects will also be deleted.")) return;
    try {
      const res = await fetch(`/api/admin/degrees?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Degree deleted", "info");
        fetchMasterCatalogs();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to delete degree", "error");
      }
    } catch (err) {
      showToast("Network error deleting degree", "error");
    }
  };

  const handleAddBranch = async (e) => {
    e.preventDefault();
    if (!newBranchName.trim() || !newBranchDegreeId || !newBranchDept.trim()) return;
    try {
      const res = await fetch("/api/admin/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newBranchName.trim(), degreeId: newBranchDegreeId, department: newBranchDept.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Branch added!", "success");
        setNewBranchName("");
        setNewBranchDept("");
        fetchMasterCatalogs();
      } else {
        showToast(data.error || "Failed to add branch", "error");
      }
    } catch (err) {
      showToast("Network error adding branch", "error");
    }
  };

  const handleDeleteBranch = async (id) => {
    if (!confirm("Delete this branch? All linked subjects will also be deleted.")) return;
    try {
      const res = await fetch(`/api/admin/branches?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Branch deleted", "info");
        fetchMasterCatalogs();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to delete branch", "error");
      }
    } catch (err) {
      showToast("Network error deleting branch", "error");
    }
  };

  const handleAddRegulation = async (e) => {
    e.preventDefault();
    if (!newRegCode.trim()) return;
    try {
      const res = await fetch("/api/admin/regulations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: newRegCode.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Regulation added!", "success");
        setNewRegCode("");
        fetchMasterCatalogs();
      } else {
        showToast(data.error || "Failed to add regulation", "error");
      }
    } catch (err) {
      showToast("Network error adding regulation", "error");
    }
  };

  const handleDeleteRegulation = async (id) => {
    if (!confirm("Delete this regulation? All linked subjects will also be deleted.")) return;
    try {
      const res = await fetch(`/api/admin/regulations?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Regulation deleted", "info");
        fetchMasterCatalogs();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to delete regulation", "error");
      }
    } catch (err) {
      showToast("Network error deleting regulation", "error");
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubjectBranchId || !newSubjectRegulationId) {
      showToast("Please select a branch and regulation first", "error");
      return;
    }
    try {
      const res = await fetch("/api/admin/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newSubjectCode,
          title: newSubjectTitle,
          credits: parseInt(newSubjectCredits),
          branchId: newSubjectBranchId,
          regulationId: newSubjectRegulationId
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Subject added successfully!", "success");
        setNewSubjectCode("");
        setNewSubjectTitle("");
        setNewSubjectCredits("3");
        fetchSubjects(curriculumBranchId, curriculumRegulationId);
        fetchMasterCatalogs(); // refresh subject counts
      } else {
        showToast(data.error || "Failed to add subject", "error");
      }
    } catch (err) {
      showToast("Network error adding subject", "error");
    }
  };

  const handleUpdateSubject = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/subjects", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingSubject.id,
          code: editSubjectCode,
          title: editSubjectTitle,
          credits: parseInt(editSubjectCredits),
          branchId: editingSubject.branchId,
          regulationId: editingSubject.regulationId
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast("Subject updated successfully!", "success");
        setEditingSubject(null);
        fetchSubjects(curriculumBranchId, curriculumRegulationId);
      } else {
        showToast(data.error || "Failed to update subject", "error");
      }
    } catch (err) {
      showToast("Network error updating subject", "error");
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    try {
      const res = await fetch(`/api/admin/subjects?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        showToast("Subject deleted successfully", "info");
        fetchSubjects(curriculumBranchId, curriculumRegulationId);
        fetchMasterCatalogs(); // refresh subject counts
      } else {
        showToast(data.error || "Failed to delete subject", "error");
      }
    } catch (err) {
      showToast("Network error deleting subject", "error");
    }
  };


  const emptyUserForm = () => ({
    rollNumber: "",
    name: "",
    password: "",
    role: "STUDENT",
    branch: "",
    batch: "",
    shareWithPR: false,
    prBranch: "",
    prBatch: "",
  });

  const openCreateUser = () => {
    setEditingUser({ mode: "create" });
    setUserForm(emptyUserForm());
  };

  const openEditUser = (targetUser) => {
    setEditingUser({ mode: "edit", rollNumber: targetUser.rollNumber });
    setUserForm({
      rollNumber: targetUser.rollNumber,
      name: targetUser.name,
      password: "",
      role: targetUser.role,
      branch: targetUser.branch,
      batch: targetUser.batch,
      shareWithPR: Boolean(targetUser.shareWithPR),
      prBranch: targetUser.prBranch || targetUser.branch,
      prBatch: targetUser.prBatch || targetUser.batch,
    });
  };

  const updateUserForm = (field, value) => {
    setUserForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const res = await fetch("/api/admin/users", {
        method: editingUser.mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });
      const data = await res.json();

      if (res.ok) {
        showToast(editingUser.mode === "create" ? "User created successfully" : "User updated successfully", "success");
        setEditingUser(null);
        setUserForm(emptyUserForm());
        fetchAdminUsers();
      } else {
        showToast(data.error || "Failed to save user", "error");
      }
    } catch (err) {
      showToast("Network error saving user", "error");
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (!confirm(`Delete ${targetUser.name} (${targetUser.rollNumber}) and all linked grade data?`)) return;

    try {
      const res = await fetch(`/api/admin/users?rollNumber=${encodeURIComponent(targetUser.rollNumber)}`, { method: "DELETE" });
      const data = await res.json();

      if (res.ok) {
        showToast("User deleted successfully", "info");
        fetchAdminUsers();
      } else {
        showToast(data.error || "Failed to delete user", "error");
      }
    } catch (err) {
      showToast("Network error deleting user", "error");
    }
  };


  const handlePromote = async (e) => {
    e.preventDefault();
    if (!promotingUser) return;
    
    try {
      const res = await fetch("/api/admin/promote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber: promotingUser.rollNumber,
          role: promotedRole,
          prBranch: promotedRole === "PR" ? promotedBranch : null,
          prBatch: promotedRole === "PR" ? promotedBatch : null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, "success");
        setPromotingUser(null);
        fetchAdminUsers();
      } else {
        showToast(data.error || "Failed to update user role", "error");
      }
    } catch (err) {
      showToast("Network error updating role", "error");
    }
  };

  const fetchCaptcha = async () => {
    setScrapeLoadingCaptcha(true);
    try {
      const res = await fetch("/api/scrape/captcha");
      const data = await res.json();
      if (res.ok && data.success) {
        setScrapeCaptchaImg(data.captchaImg);
        setScrapeCookie(data.sessionCookie);
        setScrapeCaptchaCode("");
      } else {
        showToast(data.error || "Failed to load CAPTCHA image", "error");
      }
    } catch (err) {
      showToast("Error connecting to SEMS CAPTCHA service", "error");
    } finally {
      setScrapeLoadingCaptcha(false);
    }
  };

  const triggerScrape = async (forceCaptcha = false) => {
    if (!user) return;

    // Check if running on localhost to toggle between local Playwright window and hosted Captcha modal
    const isLocal = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    if (isLocal && !forceCaptcha) {
      setScraping(true);
      showToast("Opening SEMS portal in local browser window. Please complete login & CAPTCHA there!", "info");
      try {
        const res = await fetch("/api/scrape", { method: "POST" });
        const data = await res.json();
        if (res.ok) {
          showToast(data.message, "success");
          setSemesters(data.semesters || []);
          setGrades(data.grades || []);
          setHasGrades(true);
        } else {
          showToast(data.error || "Scraping failed", "error");
        }
      } catch (err) {
        showToast("Scraping execution error", "error");
      } finally {
        setScraping(false);
      }
    } else {
      // Production or Force Captcha: Open the CAPTCHA modal form
      setScrapeRollNumber(user.rollNumber);
      setScrapePassword("");
      setScrapeCaptchaCode("");
      setShowScrapeModal(true);
      fetchCaptcha();
    }
  };

  const handleScrapeSubmit = async (e) => {
    e.preventDefault();
    if (!scrapeRollNumber || !scrapePassword || !scrapeCaptchaCode || !scrapeCookie) {
      showToast("All fields and CAPTCHA are required", "error");
      return;
    }
    setScrapeSubmitting(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber: scrapeRollNumber,
          semsPassword: scrapePassword,
          captchaCode: scrapeCaptchaCode,
          sessionCookie: scrapeCookie
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(data.message, "success");
        setSemesters(data.semesters || []);
        setGrades(data.grades || []);
        setHasGrades(true);
        setShowScrapeModal(false);
        setScrapePassword("");
        setScrapeCaptchaCode("");
      } else {
        showToast(data.error || "SEMS synchronization failed", "error");
        // Reload CAPTCHA because the previous one is now invalid/expired
        fetchCaptcha();
      }
    } catch (err) {
      showToast("SEMS synchronization execution error", "error");
      fetchCaptcha();
    } finally {
      setScrapeSubmitting(false);
    }
  };

  const triggerManualImport = async (e) => {
    e.preventDefault();
    if (!manualHtml || !manualSem) {
      showToast("Semester and HTML code are required", "error");
      return;
    }
    setScraping(true);
    try {
      const res = await fetch("/api/scrape", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ semesterNo: manualSem, html: manualHtml }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, "success");
        setSemesters(data.semesters || []);
        setGrades(data.grades || []);
        setHasGrades(true);
        setManualHtml("");
        setShowManualImport(false);
      } else {
        showToast(data.error || "HTML parsing failed", "error");
      }
    } catch (err) {
      showToast("HTML parsing execution error", "error");
    } finally {
      setScraping(false);
    }
  };

  const togglePRShare = async (e) => {
    const isChecked = e.target.checked;
    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shareWithPR: isChecked }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        showToast(
          isChecked 
            ? "Shared results with your Placement Representative!" 
            : "Revoked results sharing with PR.",
          "info"
        );
      } else {
        showToast(data.error || "Failed to update sharing preference", "error");
      }
    } catch (err) {
      showToast("Error updating sharing settings", "error");
    }
  };

  const csvValue = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;

  const downloadCSV = (filename, rows) => {
    const csvContent = rows.map(row => row.map(csvValue).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // CSV Exporter for Placement representatives
  const exportPRDataCSV = () => {
    if (prStudents.length === 0) return;

    const rows = [["Roll Number", "Name", "Branch", "Batch", "CGPA", "Total Credits", "Active Arrears", "Status"]];

    prStudents.forEach(s => {
      const status = s.activeBacklogs > 0 ? "RA (Arrears)" : "CLEAR";
      rows.push([s.rollNumber, s.name, s.branch, s.batch, s.cgpa, s.totalCredits, s.activeBacklogs, status]);
    });

    downloadCSV(`${prScope.branch.replace(/\s+/g, "_")}_batch_${prScope.batch}_placement_report.csv`, rows);
  };

  const exportSelectedPRDataCSV = () => {
    const studentsToExport = prStudents.filter(s => selectedPRRolls.includes(s.rollNumber));
    if (studentsToExport.length === 0) {
      showToast("Select at least one student to export", "error");
      return;
    }

    const semesterSet = new Set(selectedPRSemesters.map(Number));
    const rows = [[
      "Roll Number",
      "Name",
      "Branch",
      "Batch",
      "Semester",
      "Semester GPA",
      "Course Code",
      "Course Title",
      "Credits",
      "Grade",
      "Grade Points",
      "Status",
      "CGPA",
      "Active Arrears",
    ]];

    studentsToExport.forEach(student => {
      student.grades
        .filter(g => semesterSet.size === 0 || semesterSet.has(g.semesterNo))
        .sort((a, b) => a.semesterNo - b.semesterNo || a.courseCode.localeCompare(b.courseCode))
        .forEach(g => {
          const summary = student.semesters.find(s => s.semesterNo === g.semesterNo);
          const isPending = g.status === "NOT_PUBLISHED";
          rows.push([
            student.rollNumber,
            student.name,
            student.branch,
            student.batch,
            g.semesterNo,
            summary ? summary.gpa : "",
            g.courseCode,
            g.courseTitle,
            g.credits,
            isPending ? "Not Published" : g.grade,
            isPending ? "" : g.gradePoints,
            isPending ? "Not Published" : g.status,
            student.cgpa,
            student.activeBacklogs,
          ]);
        });
    });

    if (rows.length === 1) {
      showToast("No grade rows match the selected semester filter", "error");
      return;
    }

    const semPart = semesterSet.size > 0 ? `_sem_${[...semesterSet].sort((a, b) => a - b).join("_")}` : "_all_sems";
    downloadCSV(`selected_pr_students${semPart}.csv`, rows);
  };

  const togglePRStudentSelection = (rollNumber) => {
    setSelectedPRRolls(prev => (
      prev.includes(rollNumber)
        ? prev.filter(r => r !== rollNumber)
        : [...prev, rollNumber]
    ));
  };

  const togglePRSemesterSelection = (semNo) => {
    setSelectedPRSemesters(prev => (
      prev.includes(semNo)
        ? prev.filter(s => s !== semNo)
        : [...prev, semNo]
    ));
  };

  // GPA / CGPA Calculations
  const uniqueGrades = getLatestUniqueGrades(grades);
  const publishedGrades = uniqueGrades.filter(g => g.status !== "NOT_PUBLISHED");
  
  // Group published unique grades by semester
  const gradesBySem = {};
  publishedGrades.forEach(g => {
    if (!gradesBySem[g.semesterNo]) {
      gradesBySem[g.semesterNo] = [];
    }
    gradesBySem[g.semesterNo].push(g);
  });

  const semesterGpas = [];
  let totalCredits = 0;
  let totalPoints = 0;
  
  Object.keys(gradesBySem).forEach(semNo => {
    const semGrades = gradesBySem[semNo];
    const passedSemGrades = semGrades.filter(g => g.status === "PASS" || g.gradePoints > 0);
    const semPoints = passedSemGrades.reduce((acc, curr) => acc + (curr.credits * curr.gradePoints), 0);
    const semCredits = passedSemGrades.reduce((acc, curr) => acc + curr.credits, 0);
    if (semCredits > 0) {
      const semGpa = parseFloat((semPoints / semCredits).toFixed(2));
      semesterGpas.push(semGpa);
      totalCredits += semCredits;
      totalPoints += semPoints;
    }
  });

  const currentCgpa = semesterGpas.length > 0 
    ? parseFloat((semesterGpas.reduce((acc, val) => acc + val, 0) / semesterGpas.length).toFixed(2)) 
    : 0.0;
  
  // Arrears are calculated based on the latest attempt of each unique course code
  const arrearsCount = uniqueGrades.filter(g => 
    g.status !== "NOT_PUBLISHED" && 
    (g.status === "FAIL" || g.status === "RA" || g.grade === "RA" || g.grade === "U")
  ).length;

  const inferredSem = (() => {
    if (!user || !user.batch) return null;
    const match = user.batch.match(/\b(20\d{2})\b/);
    if (!match) return null;
    const startYear = parseInt(match[1]);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0 = Jan, 6 = July
    let sem = (currentYear - startYear) * 2;
    if (currentMonth >= 6) { // July onwards
      sem += 1;
    }
    return Math.max(1, sem);
  })();

  // Grade Count Distribution mapping
  const gradeDistribution = { O: 0, "A+": 0, A: 0, "B+": 0, B: 0, C: 0, RA: 0 };
  publishedGrades.forEach(g => {
    if (g.grade === "O") gradeDistribution.O++;
    else if (g.grade === "A+") gradeDistribution["A+"]++;
    else if (g.grade === "A") gradeDistribution.A++;
    else if (g.grade === "B+") gradeDistribution["B+"]++;
    else if (g.grade === "B") gradeDistribution.B++;
    else if (g.grade === "C") gradeDistribution.C++;
    else if (g.grade === "RA" || g.grade === "U") gradeDistribution.RA++;
  });

  // What-If Math
  const targetRequiredGpa = (() => {
    const target = parseFloat(targetCgpa);
    const remCreds = parseInt(remainingCredits);
    if (isNaN(target) || isNaN(remCreds) || remCreds <= 0) return null;
    
    // CGPA = (totalPoints + (remCreds * reqGpa)) / (totalCredits + remCreds)
    // target * (totalCredits + remCreds) = totalPoints + remCreds * reqGpa
    // reqGpa = (target * (totalCredits + remCreds) - totalPoints) / remCreds
    const reqGpa = ((target * (totalCredits + remCreds)) - totalPoints) / remCreds;
    return reqGpa > 0 ? parseFloat(reqGpa.toFixed(2)) : 0.0;
  })();

  // Simulated Custom Courses Addition
  const addSimCourse = () => {
    setSimulatedCourses([
      ...simulatedCourses,
      { id: Math.random().toString(), credits: 3, grade: "O" }
    ]);
  };

  const removeSimCourse = (id) => {
    setSimulatedCourses(simulatedCourses.filter(c => c.id !== id));
  };

  const updateSimCourse = (id, field, val) => {
    setSimulatedCourses(
      simulatedCourses.map(c => {
        if (c.id === id) {
          return { ...c, [field]: field === "credits" ? parseInt(val) : val };
        }
        return c;
      })
    );
  };

  const simulatedCgpa = (() => {
    let simPoints = totalPoints;
    let simCredits = totalCredits;
    
    simulatedCourses.forEach(c => {
      const gp = getGradePoints(c.grade);
      simPoints += c.credits * gp;
      simCredits += c.credits;
    });
    
    return simCredits > 0 ? parseFloat((simPoints / simCredits).toFixed(3)) : 0.0;
  })();

  // Filtered students for PR Leaderboard
  const filteredStudents = prStudents.filter(s => {
    // Role filter
    if (backlogFilter === "backlog") return s.activeBacklogs > 0;
    if (backlogFilter === "clear") return s.activeBacklogs === 0;
    return true;
  });

  const prPublishedStudents = prStudents.filter(s => s.totalCredits > 0);
  const prAverageCgpa = prPublishedStudents.length > 0
    ? prPublishedStudents.reduce((acc, s) => acc + s.cgpa, 0) / prPublishedStudents.length
    : 0;
  const prTopper = [...prPublishedStudents].sort((a, b) => b.cgpa - a.cgpa)[0];
  const prAtRiskCount = prStudents.filter(s => s.activeBacklogs > 0 || s.cgpa < 6).length;
  const prAvailableSemesters = [...new Set(prStudents.flatMap(s => s.grades.map(g => g.semesterNo)))]
    .sort((a, b) => a - b);

  // Native SVG Line Chart Math for GPA Trend
  const renderGpaTrendChart = () => {
    const trendSemesters = semesters.filter(sem => {
      const semGrades = grades.filter(g => g.semesterNo === sem.semesterNo);
      return semGrades.some(g => g.status !== "NOT_PUBLISHED");
    });
    
    if (trendSemesters.length === 0) return <div style={{color: "var(--text-muted)", fontSize: "0.875rem"}}>No results loaded yet to plot trend.</div>;
    
    const chartHeight = 160;
    const chartWidth = 500;
    const paddingLeft = 30;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 20;
    
    const usableWidth = chartWidth - paddingLeft - paddingRight;
    const usableHeight = chartHeight - paddingTop - paddingBottom;
    
    const points = trendSemesters.map((sem, i) => {
      const x = paddingLeft + (i * (usableWidth / Math.max(1, trendSemesters.length - 1)));
      // GPA mapping: 10 is at y=0, 0 is at y=usableHeight
      const y = paddingTop + (usableHeight - (sem.gpa * (usableHeight / 10)));
      return { x, y, ...sem };
    });
    
    let pathD = "";
    if (points.length > 0) {
      pathD = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        pathD += ` L ${points[i].x} ${points[i].y}`;
      }
    }
    
    return (
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="gpa-svg-chart" style={{ width: "100%", height: "auto" }}>
        <defs>
          <linearGradient id="chart-glow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(99, 102, 241, 0.2)" />
            <stop offset="100%" stopColor="rgba(99, 102, 241, 0.0)" />
          </linearGradient>
        </defs>
        
        {/* Horizontal grid lines for GPA thresholds: 10, 8, 6, 4 */}
        {[10, 8, 6, 4].map(val => {
          const gridY = paddingTop + (usableHeight - (val * (usableHeight / 10)));
          return (
            <g key={val}>
              <line x1={paddingLeft} y1={gridY} x2={chartWidth - paddingRight} y2={gridY} stroke="rgba(255,255,255,0.04)" strokeDasharray="3,3" />
              <text x={paddingLeft - 8} y={gridY + 4} fill="var(--text-muted)" fontSize="9px" fontWeight="600" textAnchor="end">{val}</text>
            </g>
          );
        })}
        
        {/* Fill Area under path */}
        {points.length > 0 && (
          <path 
            d={`${pathD} L ${points[points.length - 1].x} ${paddingTop + usableHeight} L ${points[0].x} ${paddingTop + usableHeight} Z`} 
            fill="url(#chart-area)" 
          />
        )}
        
        {/* Trend Line */}
        <path d={pathD} fill="none" stroke="url(#chart-glow)" strokeWidth="3" strokeLinecap="round" />
        
        {/* Data points and labels */}
        {points.map((p, i) => (
          <g key={p.semesterNo} className="chart-dot-group">
            <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" stroke="var(--primary)" strokeWidth="2.5" />
            <text x={p.x} y={p.y - 8} fill="var(--text-primary)" fontSize="10px" fontWeight="800" textAnchor="middle">{p.gpa}</text>
            <text x={p.x} y={paddingTop + usableHeight + 14} fill="var(--text-secondary)" fontSize="9px" fontWeight="700" textAnchor="middle">Sem {p.semesterNo}</text>
          </g>
        ))}
      </svg>
    );
  };

  const registrationBranches = selectedDegreeId
    ? branchesList.filter(b => b.degreeId === selectedDegreeId)
    : [];

  // Render Loader screen
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#06070d" }}>
        <div style={{ textAlign: "center" }}>
          <div className="brand-title" style={{ fontSize: "2rem", marginBottom: "1rem" }}>SEMS ANALYZER</div>
          <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>Securing connection and loading session...</div>
        </div>
      </div>
    );
  }

  // Render Authentication Forms
  if (!user) {
    return (
      <div className="app-container" style={{ justifyContent: "center" }}>
        <div className="brand-section" style={{ alignItems: "center", marginBottom: "1rem" }}>
          <div className="brand-title" style={{ fontSize: "2.5rem" }}>SEMS ANALYZER</div>
          <div className="brand-subtitle">Anna University (CEG / MIT) Placement & GPA Suite</div>
        </div>
        
        <div className="glass-card auth-wrapper">
          <div className="auth-title">{authMode === "login" ? "Welcome Back" : "Create Account"}</div>
          
          <form onSubmit={authMode === "login" ? handleLogin : handleRegister}>
            <div className="form-group">
              <label className="form-label">SEMS Roll Number</label>
              <input 
                type="text" 
                required 
                className="form-input" 
                placeholder="2022103501" 
                value={rollNumber}
                onChange={e => setRollNumber(e.target.value)}
              />
            </div>
            
            {authMode === "register" && (
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input" 
                    placeholder="Saby" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                
                {/* Degree & Branch: smart dropdown when catalog loaded, free-text fallback when empty */}
                {degrees.length > 0 ? (
                  <>
                    <div className="form-group">
                      <label className="form-label">Degree</label>
                      <select
                        className="form-input"
                        required
                        value={selectedDegreeId}
                        onChange={e => {
                          const degreeId = e.target.value;
                          const firstBranch = branchesList.find(b => b.degreeId === degreeId);
                          setSelectedDegreeId(degreeId);
                          setBranch(firstBranch ? formatBranchName(firstBranch) : "");
                        }}
                      >
                        <option value="">Select degree</option>
                        {degrees.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Branch</label>
                      <select
                        className="form-input"
                        required
                        value={branch}
                        disabled={registrationBranches.length === 0}
                        onChange={e => setBranch(e.target.value)}
                      >
                        <option value="">
                          {selectedDegreeId ? "Select branch" : "Select degree first"}
                        </option>
                        {registrationBranches.map(b => (
                          <option key={b.id} value={formatBranchName(b)}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Fallback: free-text when catalog not yet set up by admin */}
                    <div className="form-group">
                      <label className="form-label">Degree</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. MSc Integrated"
                        value={branch.split(" ").slice(0, 2).join(" ") || ""}
                        onChange={e => setBranch(e.target.value + (branch.includes(" - ") ? branch.slice(branch.indexOf(" - ")) : ""))}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Branch / Programme</label>
                      <input
                        type="text"
                        required
                        className="form-input"
                        placeholder="e.g. Information Technology"
                        value={branch}
                        onChange={e => setBranch(e.target.value)}
                      />
                      <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
                        Curriculum catalog not set up yet. An admin will configure it later.
                      </div>
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label className="form-label">Batch Duration</label>
                  <input 
                    type="text" 
                    required 
                    className="form-input" 
                    placeholder="2022-2027" 
                    value={batch}
                    onChange={e => setBatch(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Admin Passcode (Optional)</label>
                  <input 
                    type="password" 
                    className="form-input" 
                    placeholder="Enter key to register as Admin" 
                    value={adminPasscode}
                    onChange={e => setAdminPasscode(e.target.value)}
                  />
                </div>
              </>
            )}
            
            <div className="form-group">
              <label className="form-label">Portal password</label>
              <input 
                type="password" 
                required 
                className="form-input" 
                placeholder="" 
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            
            <button
              type="submit"
              className="submit-btn"
              disabled={authMode === "register" && catalogLoading}
              style={{ marginTop: "1rem" }}
            >
              {authMode === "login" ? "Sign In" : catalogLoading ? "Loading Catalog..." : "Register"}
            </button>
          </form>
          
          <div className="auth-footer">
            {authMode === "login" ? (
              <>
                New student? <span className="auth-link" onClick={() => setAuthMode("register")}>Register here</span>
              </>
            ) : (
              <>
                Already registered? <span className="auth-link" onClick={() => setAuthMode("login")}>Sign in here</span>
              </>
            )}
          </div>
        </div>
        
        {toast && (
          <div className={`alert-toast ${toast.type}`}>
            {toast.message}
          </div>
        )}
      </div>
    );
  }

  // Render Logged-in Application Dashboards
  return (
    <div className="app-container">
      {/* Navigation bar */}
      <header className="app-header glass-card">
        <div className="brand-section">
          <div className="brand-title">SEMS ANALYZER</div>
          <div className="brand-subtitle">{user.name} ({user.rollNumber})  {user.branch}</div>
        </div>
        
        <div className="nav-section">
          <span className="role-badge">{user.role}</span>
          
          {/* Role Switching for PR/Admin */}
          {(user.role === "PR" || user.role === "ADMIN") && (
            <div className="role-selector-tabs">
              <button 
                className={`tab-btn ${currentTab === "student" ? "active" : ""}`}
                onClick={() => setCurrentTab("student")}
              >
                Student View
              </button>
              
              <button 
                className={`tab-btn ${currentTab === "pr" ? "active" : ""}`}
                onClick={() => setCurrentTab("pr")}
              >
                PR Console
              </button>
              
              {user.role === "ADMIN" && (
                <button 
                  className={`tab-btn ${currentTab === "admin" ? "active" : ""}`}
                  onClick={() => setCurrentTab("admin")}
                >
                  Admin Panel
                </button>
              )}
            </div>
          )}
          
          <button className="logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className={`alert-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* STUDENT VIEW VIEW */}
      {currentTab === "student" && (
        <>
          {/* KPI Row */}
          <div className="kpi-grid">
            <div className="glass-card kpi-card">
              <div className="kpi-title">Overall CGPA</div>
              <div className="kpi-value">{hasGrades ? currentCgpa : "0.00"}</div>
              <div className="kpi-sub">Calculated from {totalCredits} cleared credits</div>
            </div>
            <div className="glass-card kpi-card">
              <div className="kpi-title">Total Credits</div>
              <div className="kpi-value">{hasGrades ? totalCredits : "0"}</div>
              <div className="kpi-sub">Total credits earned till date</div>
            </div>
            <div className="glass-card kpi-card">
              <div className="kpi-title">Semesters Load</div>
              <div className="kpi-value">
                {semesters.length}
                {inferredSem && (
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "normal", marginLeft: "0.5rem" }}>
                    (Active: Sem {inferredSem})
                  </span>
                )}
              </div>
              <div className="kpi-sub">Active result logs resolved</div>
            </div>
            <div className="glass-card kpi-card">
              <div className="kpi-title">Active Arrears</div>
              <div className="kpi-value" style={{ color: arrearsCount > 0 ? "var(--danger)" : "var(--success)" }}>
                {arrearsCount}
              </div>
              <div className="kpi-sub">Subjects with standing RA/U grades</div>
            </div>
          </div>

          <div className="dashboard-layout">
            {/* Left side results & scrape panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              
              {/* Scraper controls */}
              <div className="glass-card scraper-panel">
                <div className="section-title">SEMS Results Integration</div>
                
                <div className="action-row" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                  {typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? (
                    <>
                      <button 
                        disabled={scraping} 
                        className="action-btn primary"
                        onClick={() => triggerScrape(false)}
                        style={{ flex: 1 }}
                      >
                        {scraping ? "Automation Running..." : "Start Headed Fetch"}
                      </button>
                      <button 
                        disabled={scraping} 
                        className="action-btn primary"
                        onClick={() => triggerScrape(true)}
                        style={{ flex: 1, borderColor: "var(--primary)", color: "var(--primary)", background: "rgba(139, 92, 246, 0.05)" }}
                      >
                        Start CAPTCHA Fetch
                      </button>
                    </>
                  ) : (
                    <button 
                      disabled={scraping} 
                      className="action-btn primary"
                      onClick={() => triggerScrape(true)}
                      style={{ flex: 1 }}
                    >
                      {scraping ? "Automation Running..." : "Start Automated Fetch"}
                    </button>
                  )}
                  
                  <button 
                    className="action-btn"
                    onClick={() => setShowManualImport(!showManualImport)}
                    style={{ flex: 1 }}
                  >
                    {showManualImport ? "Hide Manual Paste" : "Import via HTML Paste"}
                  </button>
                </div>

                <div className="switch-container">
                  <div className="switch-label-group">
                    <div style={{ fontWeight: "700", fontSize: "0.875rem" }}>Share Data with PR</div>
                    <div className="brand-subtitle">Allows your Placement Representative to check your GPA in class lists</div>
                  </div>
                  <label className="switch">
                    <input 
                      type="checkbox" 
                      checked={user.shareWithPR}
                      onChange={togglePRShare}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                {/* Manual HTML paste view */}
                {showManualImport && (
                  <form onSubmit={triggerManualImport} className="manual-import-box" style={{ marginTop: "1rem", borderTop: "1px solid var(--border-color)", paddingTop: "1rem" }}>
                    <div className="grid-2col">
                      <div className="form-group">
                        <label className="form-label">Which Semester?</label>
                        <select 
                          className="form-input"
                          value={manualSem}
                          onChange={e => setManualSem(e.target.value)}
                        >
                          {[1,2,3,4,5,6,7,8,9,10].map(s => (
                            <option key={s} value={s}>Semester {s}</option>
                          ))}
                        </select>
                      </div>
                      <div style={{ alignSelf: "center", color: "var(--text-secondary)", fontSize: "0.75rem" }}>
                        {"Open SEMS portal -> Go to Attendance & Marks -> Select semester -> Right-click and inspect / view page source -> Copy the source code and paste below!"}
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Raw HTML Source Code</label>
                      <textarea 
                        required 
                        className="textarea-input"
                        placeholder="Paste HTML page source here..."
                        value={manualHtml}
                        onChange={e => setManualHtml(e.target.value)}
                      />
                    </div>
                    <button type="submit" disabled={scraping} className="submit-btn">
                      {scraping ? "Parsing HTML..." : "Verify & Load Semester Table"}
                    </button>
                  </form>
                )}
              </div>

              {/* Semester Breakdown Lists */}
              <div className="glass-card">
                <div className="section-title">Semester Performance Sheet</div>
                
                {!hasGrades ? (
                  <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-secondary)" }}>
                    No academic data found. Click **Start Automated Fetch** to scrape your SEMS results or load them manually!
                  </div>
                ) : (
                  <div className="semester-list">
                    {semesters.map(sem => {
                      const semGrades = grades.filter(g => g.semesterNo === sem.semesterNo);
                      const isOpen = openSemester === sem.semesterNo;
                      
                      return (
                        <div 
                          key={sem.semesterNo} 
                          className={`semester-accordion ${isOpen ? "open" : ""}`}
                        >
                          <div 
                            className="accordion-header"
                            onClick={() => setOpenSemester(isOpen ? null : sem.semesterNo)}
                          >
                            <div className="header-left">
                              <span className="badge-pill">Sem {sem.semesterNo}</span>
                              <span style={{ fontSize: "0.95rem" }}>
                                {semGrades.length} Papers Scraped
                              </span>
                            </div>
                            <div className="header-right">
                              <span style={{ color: "var(--secondary)", fontWeight: "800" }}>
                                GPA: {semGrades.some(g => g.status !== "NOT_PUBLISHED") ? sem.gpa : "Pending"}
                              </span>
                              <span className="chevron"></span>
                            </div>
                          </div>
                          
                          <div className="accordion-content">
                            <table className="data-table">
                              <thead>
                                <tr>
                                  <th>Code</th>
                                  <th>Course Title</th>
                                  <th>Credits</th>
                                  <th>Grade</th>
                                  <th>Points</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {semGrades.map(g => (
                                  <tr key={g.id}>
                                    <td style={{ fontWeight: "700", fontFamily: "monospace" }}>{g.courseCode}</td>
                                    <td>{g.courseTitle}</td>
                                    <td>{g.credits}</td>
                                    <td>
                                      <span className={`grade-badge ${g.status === "NOT_PUBLISHED" ? "pending" : g.grade.toLowerCase().replace("+", "-plus")}`}>
                                        {g.status === "NOT_PUBLISHED" ? "Not Published" : g.grade}
                                      </span>
                                    </td>
                                    <td>{g.status === "NOT_PUBLISHED" ? "" : g.gradePoints}</td>
                                    <td>
                                      <span className={`status-pill ${g.status.toLowerCase()}`}>
                                        {g.status === "NOT_PUBLISHED" ? "Not Published" : g.status}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right side charts & projections */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              
              {/* GPA Trend Card */}
              <div className="glass-card">
                <div className="section-title">GPA Progression Trend</div>
                {renderGpaTrendChart()}
              </div>

              {/* Grade Distribution */}
              <div className="glass-card">
                <div className="section-title">Grade Distribution</div>
                {hasGrades ? (
                  <div className="chart-container">
                    {Object.keys(gradeDistribution).map(grade => {
                      const count = gradeDistribution[grade];
                      const maxVal = Math.max(...Object.values(gradeDistribution), 1);
                      const heightPercent = `${(count / maxVal) * 100}%`;
                      
                      return (
                        <div key={grade} className="chart-bar-wrapper">
                          <div className="chart-bar" style={{ height: heightPercent }}>
                            {count > 0 && <span className="chart-bar-val">{count}</span>}
                          </div>
                          <span className="chart-bar-label">{grade}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No marks loaded to analyze grades.</div>
                )}
              </div>

              {/* What-if scenario simulator */}
              <div className="glass-card simulation-panel">
                <div className="section-title">Target CGPA Simulator</div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className="grid-2col">
                    <div className="form-group">
                      <label className="form-label">Target CGPA</label>
                      <input 
                        type="number" 
                        step="0.05" 
                        className="form-input" 
                        value={targetCgpa}
                        onChange={e => setTargetCgpa(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Remaining Credits</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        value={remainingCredits}
                        onChange={e => setRemainingCredits(e.target.value)}
                      />
                    </div>
                  </div>

                  {targetRequiredGpa !== null && (
                    <div className="sim-result-box">
                      <div className="sim-result-val">
                        {targetRequiredGpa > 10 ? "Not Possible" : targetRequiredGpa.toFixed(2)}
                      </div>
                      <div className="brand-subtitle">
                        {targetRequiredGpa > 10 
                          ? "Required GPA exceeds 10.0 scale!" 
                          : "Average GPA needed in remaining semesters"}
                      </div>
                    </div>
                  )}

                  {/* Future semester hypothetical simulator */}
                  <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1rem", marginTop: "0.5rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                      <div style={{ fontWeight: "700", fontSize: "0.875rem" }}>Hypothetical Semester</div>
                      <button 
                        style={{ background: "rgba(6, 182, 212, 0.15)", border: "none", color: "var(--secondary)", cursor: "pointer", fontSize: "0.75rem", padding: "0.25rem 0.5rem", borderRadius: "4px", fontWeight: "700" }}
                        onClick={addSimCourse}
                      >
                        + Add Subject
                      </button>
                    </div>

                    {simulatedCourses.length === 0 ? (
                      <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textAlign: "center", padding: "1rem" }}>
                        Add subjects to simulate how future grades impact your current CGPA ({currentCgpa})
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "180px", overflowY: "auto", paddingRight: "4px" }}>
                        {simulatedCourses.map(c => (
                          <div key={c.id} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                            <select 
                              className="form-input" 
                              style={{ padding: "0.3rem", fontSize: "0.75rem", flex: 1 }}
                              value={c.credits}
                              onChange={e => updateSimCourse(c.id, "credits", e.target.value)}
                            >
                              {[1,2,3,4,5].map(cr => <option key={cr} value={cr}>{cr} Credits</option>)}
                            </select>
                            
                            <select 
                              className="form-input" 
                              style={{ padding: "0.3rem", fontSize: "0.75rem", flex: 1 }}
                              value={c.grade}
                              onChange={e => updateSimCourse(c.id, "grade", e.target.value)}
                            >
                              {["O", "A+", "A", "B+", "B", "C", "RA"].map(gr => <option key={gr} value={gr}>{gr} Grade</option>)}
                            </select>

                            <button 
                              style={{ background: "transparent", border: "none", color: "var(--danger)", cursor: "pointer", fontWeight: "800", fontSize: "1rem", padding: "0 0.5rem" }}
                              onClick={() => removeSimCourse(c.id)}
                            >
                              
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {simulatedCourses.length > 0 && (
                      <div className="sim-result-box" style={{ background: "rgba(6, 182, 212, 0.05)", borderColor: "var(--secondary)", marginTop: "1rem" }}>
                        <div className="sim-result-val" style={{ color: "var(--primary)" }}>{simulatedCgpa}</div>
                        <div className="brand-subtitle">Projected CGPA (with simulated courses)</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* PR DASHBOARD VIEW */}
      {currentTab === "pr" && (
        <div className="glass-card pr-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
            <div className="section-title" style={{ marginBottom: 0 }}>
              Placement Representatives Dashboard
              <span className="badge-pill" style={{ marginLeft: "0.5rem", background: "var(--primary-glow)", color: "var(--primary)", borderColor: "rgba(99,102,241,0.2)" }}>
                {prScope.branch}  Batch {prScope.batch}
              </span>
            </div>
            
            <button 
              disabled={prStudents.length === 0} 
              className="action-btn primary" 
              onClick={exportPRDataCSV}
              style={{ flex: "initial" }}
            >
              <IconExport size={14} /> Export Class CSV
            </button>
          </div>

          <div className="kpi-grid" style={{ marginBottom: "1.5rem" }}>
            <div className="glass-card kpi-card">
              <div className="kpi-title">Shared Students</div>
              <div className="kpi-value">{prStudents.length}</div>
              <div className="kpi-sub">{selectedPRRolls.length} selected for export</div>
            </div>
            <div className="glass-card kpi-card">
              <div className="kpi-title">Average CGPA</div>
              <div className="kpi-value">{prAverageCgpa.toFixed(2)}</div>
              <div className="kpi-sub">Published-credit students only</div>
            </div>
            <div className="glass-card kpi-card">
              <div className="kpi-title">Top Performer</div>
              <div className="kpi-value" style={{ fontSize: "1.1rem" }}>{prTopper ? prTopper.name : "N/A"}</div>
              <div className="kpi-sub">{prTopper ? `${prTopper.rollNumber} | CGPA ${prTopper.cgpa.toFixed(2)}` : "No published results"}</div>
            </div>
            <div className="glass-card kpi-card">
              <div className="kpi-title">Attention Needed</div>
              <div className="kpi-value" style={{ color: prAtRiskCount > 0 ? "var(--danger)" : "var(--success)" }}>{prAtRiskCount}</div>
              <div className="kpi-sub">Students with arrears or CGPA below 6</div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="search-controls">
            <div className="search-input-wrapper">
              <input 
                type="text" 
                className="form-input search-input" 
                placeholder="Search student by name or roll number (e.g., Saby)..." 
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  fetchPRStudents(e.target.value);
                }}
              />
            </div>
            
            <div className="role-selector-tabs" style={{ padding: "0.15rem" }}>
              <button 
                className={`tab-btn ${backlogFilter === "all" ? "active" : ""}`}
                onClick={() => setBacklogFilter("all")}
                style={{ fontSize: "0.75rem", padding: "0.4rem 0.8rem" }}
              >
                All ({prStudents.length})
              </button>
              <button 
                className={`tab-btn ${backlogFilter === "clear" ? "active" : ""}`}
                onClick={() => setBacklogFilter("clear")}
                style={{ fontSize: "0.75rem", padding: "0.4rem 0.8rem" }}
              >
                No Arrears ({prStudents.filter(s => s.activeBacklogs === 0).length})
              </button>
              <button 
                className={`tab-btn ${backlogFilter === "backlog" ? "active" : ""}`}
                onClick={() => setBacklogFilter("backlog")}
                style={{ fontSize: "0.75rem", padding: "0.4rem 0.8rem" }}
              >
                Standing Arrears ({prStudents.filter(s => s.activeBacklogs > 0).length})
              </button>
            </div>
          </div>

          <div className="glass-card" style={{ marginBottom: "1.5rem", padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: "800", fontSize: "0.95rem" }}>Selected Export Control</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>
                  Select students and semester scope, then export detailed subject rows.
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <button
                  className="action-btn"
                  style={{ flex: "initial", minWidth: "auto", padding: "0.5rem 0.75rem" }}
                  onClick={() => setSelectedPRRolls(filteredStudents.map(s => s.rollNumber))}
                  disabled={filteredStudents.length === 0}
                >
                  Select Filtered
                </button>
                <button
                  className="action-btn"
                  style={{ flex: "initial", minWidth: "auto", padding: "0.5rem 0.75rem" }}
                  onClick={() => setSelectedPRRolls([])}
                  disabled={selectedPRRolls.length === 0}
                >
                  Clear Selection
                </button>
                <button
                  className="action-btn primary"
                  style={{ flex: "initial", minWidth: "auto", padding: "0.5rem 0.75rem" }}
                  onClick={exportSelectedPRDataCSV}
                  disabled={selectedPRRolls.length === 0}
                >
                  Export Selected Data
                </button>
              </div>
            </div>
            <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem", fontWeight: "700" }}>Semesters:</span>
              <button
                className={`tab-btn ${selectedPRSemesters.length === 0 ? "active" : ""}`}
                style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }}
                onClick={() => setSelectedPRSemesters([])}
              >
                All
              </button>
              {prAvailableSemesters.map(semNo => (
                <button
                  key={semNo}
                  className={`tab-btn ${selectedPRSemesters.includes(semNo) ? "active" : ""}`}
                  style={{ fontSize: "0.75rem", padding: "0.35rem 0.65rem" }}
                  onClick={() => togglePRSemesterSelection(semNo)}
                >
                  Sem {semNo}
                </button>
              ))}
            </div>
          </div>

          {/* Leaderboard List */}
          {filteredStudents.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
              No students found matching filters. Make sure students sign up and enable the share toggle in their dashboards!
            </div>
          ) : (
            <div className="leaderboard-list">
              <div className="leaderboard-item" style={{ background: "transparent", border: "none", cursor: "default", paddingBottom: 0, fontWeight: "600", color: "var(--text-secondary)", fontSize: "0.75rem" }}>
                <div className="student-info">
                  <span style={{ width: "24px" }}></span>
                  <span className="rank-badge">Rank</span>
                  <span>Student Details</span>
                </div>
                <div className="student-meta">
                  <span style={{ width: "80px", textAlign: "right" }}>Total Credits</span>
                  <span style={{ width: "80px", textAlign: "right" }}>Backlogs</span>
                  <span style={{ width: "80px", textAlign: "right" }}>CGPA</span>
                </div>
              </div>
              
              {/* Sort by CGPA descending for ranking */}
              {[...filteredStudents]
                .sort((a, b) => b.cgpa - a.cgpa)
                .map((student, index) => (
                  <div 
                    key={student.rollNumber} 
                    className="leaderboard-item"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <div className="student-info">
                      <input
                        type="checkbox"
                        checked={selectedPRRolls.includes(student.rollNumber)}
                        onChange={() => togglePRStudentSelection(student.rollNumber)}
                        onClick={e => e.stopPropagation()}
                        style={{ width: "18px", height: "18px", accentColor: "var(--primary)" }}
                      />
                      <span className="rank-badge">{index + 1}</span>
                      <div className="student-name-grp">
                        <span className="student-name">{student.name}</span>
                        <span className="student-roll">{student.rollNumber}</span>
                      </div>
                    </div>
                    
                    <div className="student-meta">
                      <span className="badge-pill" style={{ width: "80px", display: "inline-block", textAlign: "center" }}>
                        {student.totalCredits}
                      </span>
                      
                      <span style={{ width: "80px", display: "inline-block", textAlign: "right" }}>
                        {student.activeBacklogs > 0 ? (
                          <span className="backlog-warn">{student.activeBacklogs} Arrears</span>
                        ) : (
                          <span style={{ color: "var(--success)", fontSize: "0.75rem", fontWeight: "700" }}>Clear</span>
                        )}
                      </span>
                      
                      <span className="student-cgpa-score" style={{ width: "80px", display: "inline-block", textAlign: "right" }}>
                        {student.cgpa.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Student Drawer Modal */}
          {selectedStudent && (
            <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
              <div className="drawer-content" onClick={e => e.stopPropagation()}>
                <div className="drawer-header">
                  <div>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "800" }}>{selectedStudent.name}</h2>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
                      Roll Number: {selectedStudent.rollNumber}  CGPA: <strong style={{ color: "var(--secondary)" }}>{selectedStudent.cgpa}</strong>
                    </p>
                  </div>
                  <button className="close-btn" onClick={() => setSelectedStudent(null)}></button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div className="section-title" style={{ fontSize: "1rem", marginBottom: 0 }}>Subject-wise Grade Sheets</div>
                  
                  {selectedStudent.grades.length === 0 ? (
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>This student has not fetched grades yet.</div>
                  ) : (
                    // Group grades by semester
                    [1,2,3,4,5,6,7,8,9,10].map(semNo => {
                      const semGrades = selectedStudent.grades.filter(g => g.semesterNo === semNo);
                      const summary = selectedStudent.semesters.find(s => s.semesterNo === semNo);
                      if (semGrades.length === 0) return null;
                      
                      return (
                        <div key={semNo} style={{ border: "1px solid var(--border-color)", borderRadius: "8px", padding: "1rem", background: "rgba(255,255,255,0.01)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem", fontWeight: "700", fontSize: "0.875rem" }}>
                            <span>Semester {semNo}</span>
                            <span style={{ color: "var(--secondary)" }}>GPA: {summary ? summary.gpa : "0.00"}</span>
                          </div>
                          
                          <table className="data-table" style={{ minWidth: "initial" }}>
                            <thead>
                              <tr>
                                <th>Code</th>
                                <th>Course Title</th>
                                <th>Credits</th>
                                <th>Grade</th>
                              </tr>
                            </thead>
                            <tbody>
                              {semGrades.map(g => (
                                <tr key={g.id}>
                                  <td style={{ fontWeight: "700", fontFamily: "monospace", fontSize: "0.8rem" }}>{g.courseCode}</td>
                                  <td style={{ fontSize: "0.8rem" }}>{g.courseTitle}</td>
                                  <td style={{ fontSize: "0.8rem" }}>{g.credits}</td>
                                  <td>
                                    <span className={`grade-badge ${g.status === "NOT_PUBLISHED" ? "pending" : g.grade.toLowerCase().replace("+", "-plus")}`}>
                                      {g.status === "NOT_PUBLISHED" ? "Not Published" : g.grade}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ADMIN VIEW PANEL */}
      {currentTab === "admin" && (
        <div className="glass-card">
          <div className="section-title">System Administration Console</div>
          
          {/* Sub-Tabs Selector */}
          <div style={{ display: "flex", gap: "1rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem", marginBottom: "1.5rem" }}>
            <button 
              className={`tab-btn ${adminSubTab === "users" ? "active" : ""}`}
              style={{ fontSize: "0.95rem" }}
              onClick={() => setAdminSubTab("users")}
            >
              <IconUsers size={14} /> User Management ({adminUsers.length})
            </button>
            <button 
              className={`tab-btn ${adminSubTab === "curriculum" ? "active" : ""}`}
              style={{ fontSize: "0.95rem" }}
              onClick={() => setAdminSubTab("curriculum")}
            >
              <IconBook size={14} /> Curriculum Database
            </button>
          </div>

          {/* Sub-Tab 1: User Management */}
          {adminSubTab === "users" && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "800" }}>All User Accounts</h4>
                  <p style={{ margin: "0.25rem 0 0 0", color: "var(--text-muted)", fontSize: "0.8rem" }}>
                    Create, edit, delete, assign PR scope, and view sharing status.
                  </p>
                </div>
                <button className="submit-btn" style={{ width: "auto", padding: "0.6rem 1rem" }} onClick={openCreateUser}>
                  + Create User
                </button>
              </div>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Roll Number</th>
                    <th>Name</th>
                    <th>Branch</th>
                    <th>Batch</th>
                    <th>System Role</th>
                    <th>PR Scope</th>
                    <th>Consenting Share</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map(u => (
                    <tr key={u.id} className="admin-user-row">
                      <td style={{ fontWeight: "700", fontFamily: "monospace" }}>{u.rollNumber}</td>
                      <td>{u.name}</td>
                      <td>{u.branch}</td>
                      <td>{u.batch}</td>
                      <td>
                        <span 
                          className="role-badge" 
                          style={{ 
                            background: u.role === "ADMIN" ? "var(--danger-bg)" : u.role === "PR" ? "var(--success-bg)" : "rgba(255,255,255,0.05)",
                            color: u.role === "ADMIN" ? "var(--danger)" : u.role === "PR" ? "var(--success)" : "var(--text-secondary)",
                            borderColor: u.role === "ADMIN" ? "rgba(244,63,94,0.3)" : u.role === "PR" ? "rgba(16,185,129,0.3)" : "var(--border-color)"
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>
                        {u.role === "PR" ? (
                          <span style={{ fontSize: "0.8rem" }}>
                            {u.prBranch}  {u.prBatch}
                          </span>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>N/A</span>
                        )}
                      </td>
                      <td>
                        <span style={{ color: u.shareWithPR ? "var(--success)" : "var(--text-muted)", fontWeight: "600" }}>
                          {u.shareWithPR ? "Active" : "Private"}
                        </span>
                      </td>
                      <td>
                        {u.rollNumber !== user.rollNumber ? (
                          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                            <button 
                              className="tab-btn" 
                              style={{ padding: "0.25rem 0.5rem", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-color)" }}
                              onClick={() => openEditUser(u)}
                            >
                              Edit
                            </button>
                            <button 
                              className="tab-btn" 
                              style={{ padding: "0.25rem 0.5rem", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.25)" }}
                              onClick={() => {
                                setPromotingUser(u);
                                setPromotedRole(u.role);
                                setPromotedBranch(u.prBranch || u.branch);
                                setPromotedBatch(u.prBatch || u.batch);
                              }}
                            >
                              Role
                            </button>
                            <button
                              className="tab-btn"
                              style={{ padding: "0.25rem 0.5rem", background: "var(--danger-bg)", border: "1px solid rgba(244,63,94,0.25)", color: "var(--danger)" }}
                              onClick={() => handleDeleteUser(u)}
                            >
                              Delete
                            </button>
                          </div>
                        ) : (
                          <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Self</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Create/Edit User Modal Dialog */}
              {editingUser && (
                <div className="modal-overlay" onClick={() => setEditingUser(null)}>
                  <div className="drawer-content" style={{ maxWidth: "520px" }} onClick={e => e.stopPropagation()}>
                    <div className="drawer-header">
                      <h3 style={{ fontSize: "1.25rem", fontWeight: "800" }}>
                        {editingUser.mode === "create" ? "Create User" : `Edit User: ${userForm.rollNumber}`}
                      </h3>
                      <button className="close-btn" onClick={() => setEditingUser(null)}></button>
                    </div>

                    <form onSubmit={handleSaveUser} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
                      <div className="grid-2col">
                        <div className="form-group">
                          <label className="form-label">Roll Number</label>
                          <input
                            type="text"
                            required
                            disabled={editingUser.mode === "edit"}
                            className="form-input"
                            value={userForm.rollNumber}
                            onChange={e => updateUserForm("rollNumber", e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Full Name</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            value={userForm.name}
                            onChange={e => updateUserForm("name", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid-2col">
                        <div className="form-group">
                          <label className="form-label">Branch</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            value={userForm.branch}
                            onChange={e => updateUserForm("branch", e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Batch</label>
                          <input
                            type="text"
                            required
                            className="form-input"
                            placeholder="2022-2027"
                            value={userForm.batch}
                            onChange={e => updateUserForm("batch", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid-2col">
                        <div className="form-group">
                          <label className="form-label">System Role</label>
                          <select
                            className="form-input"
                            value={userForm.role}
                            onChange={e => updateUserForm("role", e.target.value)}
                          >
                            <option value="STUDENT">Student</option>
                            <option value="PR">Placement Representative (PR)</option>
                            <option value="ADMIN">Administrator</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">{editingUser.mode === "create" ? "Password" : "New Password (Optional)"}</label>
                          <input
                            type="password"
                            required={editingUser.mode === "create"}
                            className="form-input"
                            value={userForm.password}
                            onChange={e => updateUserForm("password", e.target.value)}
                          />
                        </div>
                      </div>

                      <label className="switch-container" style={{ cursor: "pointer" }}>
                        <div className="switch-label-group">
                          <span style={{ fontWeight: "700", fontSize: "0.875rem" }}>Share With PR</span>
                          <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem" }}>Controls whether this student appears in PR dashboards.</span>
                        </div>
                        <span className="switch">
                          <input
                            type="checkbox"
                            checked={userForm.shareWithPR}
                            onChange={e => updateUserForm("shareWithPR", e.target.checked)}
                          />
                          <span className="slider"></span>
                        </span>
                      </label>

                      {userForm.role === "PR" && (
                        <div className="grid-2col">
                          <div className="form-group">
                            <label className="form-label">PR Scope Branches</label>
                            <textarea
                              required
                              className="textarea-input"
                              style={{ height: "90px" }}
                              placeholder="One per line or comma separated"
                              value={userForm.prBranch}
                              onChange={e => updateUserForm("prBranch", e.target.value)}
                            ></textarea>
                          </div>
                          <div className="form-group">
                            <label className="form-label">PR Scope Batch</label>
                            <input
                              type="text"
                              required
                              className="form-input"
                              value={userForm.prBatch}
                              onChange={e => updateUserForm("prBatch", e.target.value)}
                            />
                          </div>
                        </div>
                      )}

                      <button type="submit" className="submit-btn" style={{ marginTop: "0.5rem" }}>
                        {editingUser.mode === "create" ? "Create User" : "Save User"}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Manage Role Modal Dialog */}
              {promotingUser && (
                <div className="modal-overlay" onClick={() => setPromotingUser(null)}>
                  <div className="drawer-content" style={{ maxWidth: "450px" }} onClick={e => e.stopPropagation()}>
                    <div className="drawer-header">
                      <h3 style={{ fontSize: "1.25rem", fontWeight: "800" }}>Manage Role: {promotingUser.name}</h3>
                      <button className="close-btn" onClick={() => setPromotingUser(null)}></button>
                    </div>
                    
                    <form onSubmit={handlePromote} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1rem" }}>
                      <div className="form-group">
                        <label className="form-label">System Role</label>
                        <select 
                          className="form-input"
                          value={promotedRole}
                          onChange={e => setPromotedRole(e.target.value)}
                        >
                          <option value="STUDENT">Student</option>
                          <option value="PR">Placement Representative (PR)</option>
                          <option value="ADMIN">Administrator</option>
                        </select>
                      </div>

                      {promotedRole === "PR" && (
                        <>
                          <div className="form-group">
                            <label className="form-label">PR Scope: Branches</label>
                            <textarea
                              required
                              className="textarea-input"
                              style={{ height: "90px" }}
                              placeholder="One per line or comma separated"
                              value={promotedBranch}
                              onChange={e => setPromotedBranch(e.target.value)}
                            ></textarea>
                          </div>
                          <div className="form-group">
                            <label className="form-label">PR Scope: Batch</label>
                            <input 
                              type="text"
                              required
                              className="form-input"
                              placeholder="e.g. 2022-2027"
                              value={promotedBatch}
                              onChange={e => setPromotedBatch(e.target.value)}
                            />
                          </div>
                        </>
                      )}

                      <button type="submit" className="submit-btn" style={{ marginTop: "1rem" }}>
                        <IconSave size={14} /> Save Changes
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Sub-Tab 2: Curriculum Database Console */}
          {adminSubTab === "curriculum" && (
            <>
              {/* Header Row */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: "700" }}>Curriculum Scope Catalog</h4>
                  <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                    Manage degree programs, branches, regulations, and course subjects.
                  </p>
                </div>
                <button
                  className="submit-btn"
                  style={{ width: "auto", padding: "0.6rem 1.25rem", display: "inline-flex", gap: "0.5rem", alignItems: "center" }}
                  onClick={handleSyncSyllabus}
                  disabled={syncingSyllabus}
                >
                  {syncingSyllabus ? (
                    <>
                      <div className="animate-spin" style={{ width: "14px", height: "14px", border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%" }}></div>
                      Syncing PDF Syllabus...
                    </>
                  ) : (
                    <><IconZap size={14} /> Import/Sync from Syllabus PDFs</>
                  )}
                </button>
              </div>

              {/*  SCOPE CATALOG GRID  */}
              {/*    SCOPE CATALOG GRID                         */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.25rem", marginBottom: "2rem" }}>

                {/* DEGREES COLUMN */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "12px", overflow: "hidden" }}>
                  <div style={{ padding: "0.85rem 1rem", borderBottom: "1px solid var(--border-color)", fontWeight: "700", fontSize: "0.875rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span><IconGraduate size={14} /> Degree Programs</span>
                    <span style={{ background: "rgba(139,92,246,0.15)", color: "var(--primary)", padding: "0.15rem 0.5rem", borderRadius: "999px", fontSize: "0.75rem" }}>
                      {degrees.length} total
                    </span>
                  </div>
                  <div style={{ padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "220px", overflowY: "auto" }}>
                    {degrees.length === 0 ? (
                      <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center", padding: "1rem 0" }}>No degrees yet</p>
                    ) : (
                      degrees.map(d => {
                        const branchCount = branchesList.filter(b => b.degreeId === d.id).length;
                        return (
                          <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.4rem 0.6rem", background: "rgba(255,255,255,0.02)", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
                            <div>
                              <div style={{ fontWeight: "600", fontSize: "0.8rem" }}>{d.name}</div>
                              <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>{branchCount} branch{branchCount !== 1 ? "es" : ""}</div>
                            </div>
                            <button
                              style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: "0.85rem", padding: "0.2rem 0.4rem", borderRadius: "4px" }}
                              onClick={() => handleDeleteDegree(d.id)}
                              title="Delete degree"
                            ><IconTrash size={13} /></button>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <form onSubmit={handleAddDegree} style={{ padding: "0.75rem", borderTop: "1px solid var(--border-color)", display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. B.E, B.Tech, MSc"
                      value={newDegreeName}
                      onChange={e => setNewDegreeName(e.target.value)}
                      style={{ flex: 1, padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
                    />
                    <button type="submit" className="submit-btn" style={{ width: "auto", padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}>+ Add</button>
                  </form>
                </div>

                {/* BRANCHES COLUMN */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "12px", overflow: "hidden" }}>
                  <div style={{ padding: "0.85rem 1rem", borderBottom: "1px solid var(--border-color)", fontWeight: "700", fontSize: "0.875rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span><IconBranch size={14} /> Branches</span>
                    <span style={{ background: "rgba(16,185,129,0.1)", color: "var(--success)", padding: "0.15rem 0.5rem", borderRadius: "999px", fontSize: "0.75rem" }}>
                      {branchesList.length} total
                    </span>
                  </div>
                  <div style={{ padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "220px", overflowY: "auto" }}>
                    {branchesList.length === 0 ? (
                      <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center", padding: "1rem 0" }}>No branches yet</p>
                    ) : (
                      branchesList.map(b => (
                        <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.4rem 0.6rem", background: "rgba(255,255,255,0.02)", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
                          <div>
                            <div style={{ fontWeight: "600", fontSize: "0.8rem" }}>{b.degree?.name} &mdash; {b.name}</div>
                            <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>{b.department}  <span style={{ color: "var(--primary)" }}>{b._count?.subjects ?? 0} subjects</span></div>
                          </div>
                          <button
                            style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: "0.85rem", padding: "0.2rem 0.4rem", borderRadius: "4px" }}
                            onClick={() => handleDeleteBranch(b.id)}
                            title="Delete branch"
                          ><IconTrash size={13} /></button>
                        </div>
                      ))
                    )}
                  </div>
                  <form onSubmit={handleAddBranch} style={{ padding: "0.75rem", borderTop: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    <select
                      className="form-input"
                      value={newBranchDegreeId}
                      onChange={e => setNewBranchDegreeId(e.target.value)}
                      style={{ padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
                    >
                      <option value="">Select Degree</option>
                      {degrees.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Branch name e.g. Information Technology"
                      value={newBranchName}
                      onChange={e => setNewBranchName(e.target.value)}
                      style={{ padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
                    />
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Department"
                        value={newBranchDept}
                        onChange={e => setNewBranchDept(e.target.value)}
                        style={{ flex: 1, padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
                      />
                      <button type="submit" className="submit-btn" style={{ width: "auto", padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}>+ Add</button>
                    </div>
                  </form>
                </div>

                {/* REGULATIONS COLUMN */}
                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", borderRadius: "12px", overflow: "hidden" }}>
                  <div style={{ padding: "0.85rem 1rem", borderBottom: "1px solid var(--border-color)", fontWeight: "700", fontSize: "0.875rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span><IconClipboard size={14} /> Regulations</span>
                    <span style={{ background: "rgba(245,158,11,0.1)", color: "var(--warning)", padding: "0.15rem 0.5rem", borderRadius: "999px", fontSize: "0.75rem" }}>
                      {regulations.length} total
                    </span>
                  </div>
                  <div style={{ padding: "0.75rem", display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "220px", overflowY: "auto" }}>
                    {regulations.length === 0 ? (
                      <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", textAlign: "center", padding: "1rem 0" }}>No regulations yet</p>
                    ) : (
                      regulations.map(r => (
                        <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.4rem 0.6rem", background: "rgba(255,255,255,0.02)", borderRadius: "6px", border: "1px solid var(--border-color)" }}>
                          <div>
                            <div style={{ fontWeight: "700", fontSize: "0.85rem", fontFamily: "monospace", color: "var(--warning)" }}>R {r.code}</div>
                            <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>{r._count?.subjects ?? 0} subjects linked</div>
                          </div>
                          <button
                            style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: "0.85rem", padding: "0.2rem 0.4rem", borderRadius: "4px" }}
                            onClick={() => handleDeleteRegulation(r.id)}
                            title="Delete regulation"
                          ><IconTrash size={13} /></button>
                        </div>
                      ))
                    )}
                  </div>
                  <form onSubmit={handleAddRegulation} style={{ padding: "0.75rem", borderTop: "1px solid var(--border-color)", display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 2019, 2021"
                      value={newRegCode}
                      onChange={e => setNewRegCode(e.target.value)}
                      style={{ flex: 1, padding: "0.4rem 0.6rem", fontSize: "0.8rem" }}
                    />
                    <button type="submit" className="submit-btn" style={{ width: "auto", padding: "0.4rem 0.75rem", fontSize: "0.8rem" }}>+ Add</button>
                  </form>
                </div>
              </div>

              {/*  SUBJECTS BROWSER  */}
              <div style={{ borderTop: "1px solid var(--border-color)", paddingTop: "1.5rem" }}>
                <h4 style={{ margin: "0 0 1rem 0", fontSize: "1rem", fontWeight: "700" }}><IconBook size={16} /> Subject Browser</h4>

                {/* Scope Selector */}
                <div style={{ display: "flex", gap: "1rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
                  <div style={{ flex: "2 1 220px" }}>
                    <label className="form-label" style={{ fontSize: "0.75rem" }}>Branch Scope</label>
                    <select
                      className="form-input"
                      value={curriculumBranchId}
                      onChange={e => setCurriculumBranchId(e.target.value)}
                      style={{ padding: "0.5rem" }}
                    >
                      <option value="">-- Select a Branch --</option>
                      {branchesList.map(b => (
                        <option key={b.id} value={b.id}>
                          {b.degree?.name} &mdash; {b.name} ({b._count?.subjects ?? 0} subjects)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: "1 1 140px" }}>
                    <label className="form-label" style={{ fontSize: "0.75rem" }}>Regulation</label>
                    <select
                      className="form-input"
                      value={curriculumRegulationId}
                      onChange={e => setCurriculumRegulationId(e.target.value)}
                      style={{ padding: "0.5rem" }}
                    >
                      <option value=""> Select Regulation </option>
                      {regulations.map(r => (
                        <option key={r.id} value={r.id}>R {r.code}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subjects Table */}
                {!curriculumBranchId || !curriculumRegulationId ? (
                  <div style={{ textAlign: "center", padding: "3rem", background: "rgba(255,255,255,0.01)", border: "1px dashed var(--border-color)", borderRadius: "12px" }}>
                    <p style={{ color: "var(--text-muted)" }}>Select a Branch and Regulation above to browse subjects.</p>
                  </div>
                ) : subjectsLoading ? (
                  <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)" }}>
                    <div className="animate-spin" style={{ display: "inline-block", width: "24px", height: "24px", border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", marginBottom: "1rem" }}></div>
                    <p>Loading subjects...</p>
                  </div>
                ) : (
                  <>
                    {/* Add Subject Form */}
                    <details style={{ marginBottom: "1rem" }}>
                      <summary style={{ cursor: "pointer", color: "var(--primary)", fontWeight: "600", fontSize: "0.875rem", padding: "0.5rem 0" }}>
                         Add Subject to this Scope
                      </summary>
                      <form
                        onSubmit={handleAddSubject}
                        style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "flex-end", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", padding: "1rem", borderRadius: "10px", marginTop: "0.5rem" }}
                      >
                        <div style={{ flex: "1 1 110px" }} className="form-group">
                          <label className="form-label" style={{ fontSize: "0.75rem" }}>Course Code</label>
                          <input type="text" className="form-input" placeholder="e.g. HS5152" required value={newSubjectCode} onChange={e => setNewSubjectCode(e.target.value)} style={{ padding: "0.45rem" }} />
                        </div>
                        <div style={{ flex: "2 1 200px" }} className="form-group">
                          <label className="form-label" style={{ fontSize: "0.75rem" }}>Course Title</label>
                          <input type="text" className="form-input" placeholder="e.g. Communicative English" required value={newSubjectTitle} onChange={e => setNewSubjectTitle(e.target.value)} style={{ padding: "0.45rem" }} />
                        </div>
                        <div style={{ flex: "0 0 80px" }} className="form-group">
                          <label className="form-label" style={{ fontSize: "0.75rem" }}>Credits</label>
                          <input type="number" className="form-input" min="1" max="20" required value={newSubjectCredits} onChange={e => setNewSubjectCredits(e.target.value)} style={{ padding: "0.45rem" }} />
                        </div>
                        <div style={{ flex: "0 0 auto" }}>
                          <button type="button" style={{ marginBottom: "0", fontSize: "0.7rem", color: "var(--text-muted)", background: "none", border: "none", cursor: "default" }}>
                            Scope: {branchesList.find(b => b.id === curriculumBranchId)?.name}  R{regulations.find(r => r.id === curriculumRegulationId)?.code}
                          </button>
                        </div>
                        <input type="hidden" value={curriculumBranchId} onChange={() => setNewSubjectBranchId(curriculumBranchId)} />
                        <input type="hidden" value={curriculumRegulationId} onChange={() => setNewSubjectRegulationId(curriculumRegulationId)} />
                        <button type="submit" className="submit-btn" style={{ width: "auto", height: "40px", padding: "0 1.25rem" }}
                          onClick={() => { setNewSubjectBranchId(curriculumBranchId); setNewSubjectRegulationId(curriculumRegulationId); }}>
                          Add Subject
                        </button>
                      </form>
                    </details>

                    {subjects.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "3rem", background: "rgba(255,255,255,0.01)", border: "1px dashed var(--border-color)", borderRadius: "12px" }}>
                        <p style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>No subjects in this scope yet.</p>
                        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Click <strong> Import/Sync from Syllabus PDFs</strong> to auto-import, or use the form above.</p>
                      </div>
                    ) : (
                      <table className="data-table">
                        <thead>
                          <tr>
                            <th style={{ width: "120px" }}>Code</th>
                            <th>Course Title</th>
                            <th style={{ width: "80px", textAlign: "center" }}>Credits</th>
                            <th style={{ width: "160px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {subjects.map(s => (
                            <tr key={s.id}>
                              <td style={{ fontWeight: "700", fontFamily: "monospace", color: "var(--primary)" }}>{s.code}</td>
                              <td>{s.title}</td>
                              <td style={{ textAlign: "center" }}>
                                <span style={{ background: "rgba(139,92,246,0.1)", color: "var(--primary)", padding: "0.15rem 0.5rem", borderRadius: "999px", fontWeight: "700", fontSize: "0.8rem" }}>
                                  {s.credits}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                  <button
                                    className="tab-btn"
                                    style={{ padding: "0.25rem 0.5rem", background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)", color: "var(--success)" }}
                                    onClick={() => { setEditingSubject(s); setEditSubjectCode(s.code); setEditSubjectTitle(s.title); setEditSubjectCredits(s.credits.toString()); }}
                                  >
                                    <IconEdit size={12} /> Edit
                                  </button>
                                  <button
                                    className="tab-btn"
                                    style={{ padding: "0.25rem 0.5rem", background: "rgba(244,63,94,0.05)", border: "1px solid rgba(244,63,94,0.2)", color: "var(--danger)" }}
                                    onClick={() => handleDeleteSubject(s.id)}
                                  >
                                    <IconTrash size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </>
                )}
              </div>

              {/* Subject Editor Modal */}
              {editingSubject && (
                <div className="modal-overlay" onClick={() => setEditingSubject(null)}>
                  <div className="drawer-content" style={{ maxWidth: "450px" }} onClick={e => e.stopPropagation()}>
                    <div className="drawer-header">
                      <div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: "800" }}>Edit Subject</h3>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: 0 }}>
                          Scope: {editingSubject.branch?.degree?.name} &mdash; {editingSubject.branch?.name} &mdash; R{editingSubject.regulation?.code}
                        </p>
                      </div>
                      <button className="close-btn" onClick={() => setEditingSubject(null)}><IconX size={14} /></button>
                    </div>
                    <form onSubmit={handleUpdateSubject} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1rem" }}>
                      <div className="form-group">
                        <label className="form-label">Course Code</label>
                        <input type="text" required className="form-input" value={editSubjectCode} onChange={e => setEditSubjectCode(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Course Title</label>
                        <input type="text" required className="form-input" value={editSubjectTitle} onChange={e => setEditSubjectTitle(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Credits Weightage</label>
                        <input type="number" required min="1" max="20" className="form-input" value={editSubjectCredits} onChange={e => setEditSubjectCredits(e.target.value)} />
                      </div>
                      <button type="submit" className="submit-btn" style={{ marginTop: "0.5rem" }}>
                        <IconSave size={14} /> Save Changes
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      )}

      {/* SEMS Authentication Scraper Modal */}
      {showScrapeModal && (
        <div className="modal-overlay" onClick={() => setShowScrapeModal(false)}>
          <div className="drawer-content" style={{ maxWidth: "450px" }} onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "800" }}>SEMS Portal Integration</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", margin: 0 }}>
                  Enter your SEMS credentials and CAPTCHA to sync all semester grades.
                </p>
              </div>
              <button className="close-btn" onClick={() => setShowScrapeModal(false)}>
                <IconX size={14} />
              </button>
            </div>
            
            <form onSubmit={handleScrapeSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Student Roll Number</label>
                <input 
                  type="text" 
                  required 
                  className="form-input" 
                  value={scrapeRollNumber} 
                  onChange={e => setScrapeRollNumber(e.target.value)} 
                  disabled={user && user.role?.toLowerCase() === 'student'}
                  style={user && user.role?.toLowerCase() === 'student' ? { opacity: 0.7, cursor: "not-allowed", backgroundColor: "rgba(255, 255, 255, 0.05)" } : {}}
                />
              </div>

              <div className="form-group">
                <label className="form-label">SEMS Student Password</label>
                <input 
                  type="password" 
                  required 
                  placeholder="Enter your SEMS portal password"
                  className="form-input" 
                  value={scrapePassword} 
                  onChange={e => setScrapePassword(e.target.value)} 
                />
              </div>

              <div className="form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label className="form-label" style={{ margin: 0 }}>CAPTCHA Verification</label>
                  <button 
                    type="button" 
                    className="tab-btn" 
                    onClick={fetchCaptcha} 
                    disabled={scrapeLoadingCaptcha}
                    style={{ padding: "0.15rem 0.5rem", fontSize: "0.75rem", background: "none", border: "none", color: "var(--primary)" }}
                  >
                    {scrapeLoadingCaptcha ? "Loading..." : "🔄 Reload"}
                  </button>
                </div>

                <div style={{ display: "flex", gap: "1rem", alignItems: "center", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-color)", padding: "0.75rem", borderRadius: "8px" }}>
                  {scrapeLoadingCaptcha ? (
                    <div style={{ flex: 1, textAlign: "center", fontSize: "0.85rem", color: "var(--text-muted)", padding: "0.5rem" }}>
                      Fetching captcha image...
                    </div>
                  ) : scrapeCaptchaImg ? (
                    <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                      <img 
                        src={scrapeCaptchaImg} 
                        alt="SEMS Captcha" 
                        style={{ height: "45px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)" }} 
                      />
                    </div>
                  ) : (
                    <div style={{ flex: 1, textAlign: "center", fontSize: "0.85rem", color: "var(--danger)", padding: "0.5rem" }}>
                      Failed to load captcha. Click Reload.
                    </div>
                  )}
                  
                  <input 
                    type="text" 
                    required 
                    placeholder="Type captcha code"
                    className="form-input" 
                    style={{ flex: 1, padding: "0.6rem", fontSize: "0.9rem", textAlign: "center" }}
                    value={scrapeCaptchaCode} 
                    onChange={e => setScrapeCaptchaCode(e.target.value)} 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="submit-btn" 
                style={{ marginTop: "0.5rem" }} 
                disabled={scrapeSubmitting || scrapeLoadingCaptcha}
              >
                {scrapeSubmitting ? (
                  <>
                    <div className="animate-spin" style={{ width: "14px", height: "14px", border: "2px solid currentColor", borderTopColor: "transparent", borderRadius: "50%", marginRight: "0.5rem" }}></div>
                    Syncing All Semesters...
                  </>
                ) : (
                  <>
                    <IconZap size={14} /> Sync SEMS Grades
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


function getGradePoints(grade) {
  const g = (grade || '').trim().toUpperCase();
  switch (g) {
    case 'O': return 10;
    case 'A+': return 9;
    case 'A': return 8;
    case 'B+': return 7;
    case 'B': return 6;
    case 'C': return 5;
    default: return 0;
  }
}

function formatBranchName(branch) {
  return `${branch.degree?.name || ''} ${branch.name}`.trim();
}

function getLatestUniqueGrades(grades) {
  const latestByCourse = {};
  grades.forEach(g => {
    const code = g.courseCode;
    const existing = latestByCourse[code];
    if (!existing) {
      latestByCourse[code] = g;
    } else {
      const existingIsPass = existing.status === 'PASS' || existing.gradePoints > 0;
      const newIsPass = g.status === 'PASS' || g.gradePoints > 0;
      if (newIsPass && !existingIsPass) {
        latestByCourse[code] = g;
      } else if (!newIsPass && existingIsPass) {
        // Keep the passed attempt
      } else {
        if (g.semesterNo > existing.semesterNo) {
          latestByCourse[code] = g;
        }
      }
    }
  });
  return Object.values(latestByCourse);
}

