function formatThaiDate(date) {
    if (!date) return "-";

    const d = new Date(date);

    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear() + 543} ${
        String(d.getHours()).padStart(2, "0")
    }:${String(d.getMinutes()).padStart(2, "0")}`;
}

let tickets = JSON.parse(localStorage.getItem("tickets")) || [];

   
let ticketNumber =
    Number(localStorage.getItem("ticketNumber")) || 1;



const ticketForm = document.getElementById("ticketForm");

if (ticketForm) {

    ticketForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const requesterName =
        document.getElementById("requesterName").value;
 
    const requesterEmail =
        document.getElementById("requesterEmail").value;

    const title =
        document.getElementById("title").value;

    const description =
        document.getElementById("description").value;

    const issueType =
        document.getElementById("issueType").value;

    const location =
        document.getElementById("location").value;

    const priority =
        document.getElementById("priority").value;

    const ticketId =
        `JJK-${String(ticketNumber).padStart(4, "0")}`;

    if (
        requesterName.trim() === "" ||
        title.trim() === "" ||
        description.trim() === "" ||
        location.trim() === ""
    ) {
        alert("กรุณากรอกข้อมูลให้ครบ");
        return;
    }    

    const ticket = {
        ticketId: ticketId,
        requesterName: requesterName,
        requesterEmail: requesterEmail,
        title: title,
        description: description,
        issueType: issueType,
        location: location,
        priority: priority,
        status: "Open",
        assignedTo: "",
        resolutionNote: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    tickets.push(ticket);
 
    localStorage.setItem("tickets", JSON.stringify(tickets)); 

    alert("แจ้งปัญหาเรียบร้อยแล้ว\nหมายเลข Ticket: " + ticketId);

    ticketForm.reset();
    
 
    ticketNumber++;

    localStorage.setItem("ticketNumber", ticketNumber);

    });

}

const ticketList = document.getElementById("ticketList");

if (ticketList) {

    function showTickets() {

        const latestTickets =
            JSON.parse(localStorage.getItem("tickets")) || [];

        ticketList.innerHTML = "";

        latestTickets.slice().reverse().forEach(function(ticket) {

            const ticketItem = document.createElement("div");

            ticketItem.innerHTML = `
                <h3>
                    <a href="ticket.html?id=${ticket.ticketId}">
                        ${ticket.ticketId}
                    </a>
                </h3>
                <p>หัวข้อ: ${ticket.title}</p>
                <p>ผู้แจ้ง: ${ticket.requesterName}</p>
                <p><strong>อีเมล:</strong> ${ticket.requesterEmail || "-"}</p>
                <p>ประเภท: ${ticket.issueType}</p>
                <p>สถานที่: ${ticket.location}</p>
                <p>ความเร่งด่วน: ${ticket.priority}</p>
                <p>
                    สถานะ:
                    <span class="status-badge ${
                        ticket.status === "Open"
                            ? "status-open"
                            : ticket.status === "In Progress"
                            ? "status-progress"
                            : ticket.status === "Resolved"
                            ? "status-resolved"
                            : "status-cancelled"
                    }">
                        ${ticket.status}
                    </span>
                </p>

                <div style="display: flex; justify-content: flex-end;">
                    <p style="font-size: 13px; color: #666;">
                        วันที่แจ้ง: ${
                            ticket.createdAt
                                ? new Date(ticket.createdAt).toLocaleString("th-TH")
                                
                                : "-"
                        }
                    </p>
                </div>
            `;

            ticketList.appendChild(ticketItem);

        });

    }

    showTickets();

    window.addEventListener("pageshow", function() {
        showTickets();
    });

}


const ticketDetail = document.getElementById("ticketDetail");

if (ticketDetail) {

    const params = new URLSearchParams(window.location.search);
    const ticketId = params.get("id");

    const ticket = tickets.find(function(ticket) {
        return ticket.ticketId === ticketId;
    });

    if (ticket) {

        ticketDetail.innerHTML = ` 
    <h2>${ticket.ticketId}</h2> 

        <p><strong>หัวข้อ:</strong> ${ticket.title}</p> 

        <p class="ticket-description"> 
            <strong>รายละเอียด:</strong> 
            <span>${ticket.description}</span> 
        </p> 

        <p><strong>ผู้แจ้ง:</strong> ${ticket.requesterName}</p>
        <p><strong>อีเมล:</strong> ${ticket.requesterEmail || "-"}</p>  
        <p><strong>ประเภท:</strong> ${ticket.issueType}</p> 
        <p><strong>สถานที่:</strong> ${ticket.location}</p> 
        <p><strong>ความเร่งด่วน:</strong> ${ticket.priority}</p> 
        <p>
            <strong>สถานะ:</strong>
            <span class="status-badge ${
                ticket.status === "Open"
                    ? "status-open"
                    : ticket.status === "In Progress"
                    ? "status-progress"
                    : ticket.status === "Resolved"
                    ? "status-resolved"
                    : "status-cancelled"
            }">
                ${ticket.status}
            </span>
        </p> 
        <p><strong>วันที่แจ้ง:</strong> ${formatThaiDate(ticket.createdAt)}</p>
        <p><strong>แก้ไขล่าสุด:</strong> ${formatThaiDate(ticket.updatedAt)}</p>  
        <p><strong>ผู้รับผิดชอบ:</strong> ${ticket.assignedTo || "-"}</p> 
        <p><strong>หมายเหตุการแก้ไข:</strong> ${ticket.resolutionNote || "-"}</p> 
    `;

        document.getElementById("statusSelect").value = ticket.status;

        document.getElementById("assignedSelect").value = ticket.assignedTo;

        document.getElementById("resolutionNote").value = ticket.resolutionNote;

    } else {
        

        ticketDetail.innerHTML = "<p>ไม่พบ Ticket</p>";

    }

}



const saveStatus = document.getElementById("saveStatus");

if (saveStatus && ticketDetail) {

    const params = new URLSearchParams(window.location.search);
    const ticketId = params.get("id");

    const ticket = tickets.find(function(ticket) {
        return ticket.ticketId === ticketId;
    });

    saveStatus.addEventListener("click", function() {

        const newStatus =
            document.getElementById("statusSelect").value;

        ticket.status = newStatus;
        ticket.updatedAt = new Date().toISOString();

        localStorage.setItem("tickets", JSON.stringify(tickets));

        alert("เปลี่ยนสถานะเรียบร้อย");

        location.reload();

    });

}


const saveAssigned = document.getElementById("saveAssigned");

if (saveAssigned && ticketDetail) {

    const params = new URLSearchParams(window.location.search);
    const ticketId = params.get("id");

    const ticket = tickets.find(function(ticket) {
        return ticket.ticketId === ticketId;
    });

    saveAssigned.addEventListener("click", function() {

        const newAssigned =
            document.getElementById("assignedSelect").value;

        if (ticket.assignedTo !== newAssigned) {
          
            ticket.assignedTo = newAssigned;
            ticket.assignedAt = newAssigned 
                ? new Date().toISOString() 
                : "";
            ticket.updatedAt = new Date().toISOString();
        }
        
    

        localStorage.setItem("tickets", JSON.stringify(tickets));

        alert("บันทึกผู้รับผิดชอบเรียบร้อย");

        location.reload();

    });

}



const saveNote = document.getElementById("saveNote");

if (saveNote && ticketDetail) {

    const params = new URLSearchParams(window.location.search);
    const ticketId = params.get("id");

    const ticket = tickets.find(function(ticket) {
        return ticket.ticketId === ticketId;
    });

    saveNote.addEventListener("click", function() {

        const newNote =
            document.getElementById("resolutionNote").value;

        ticket.resolutionNote = newNote;
        ticket.updatedAt = new Date().toISOString();

        localStorage.setItem("tickets", JSON.stringify(tickets));

        alert("บันทึกหมายเหตุเรียบร้อย");

        location.reload();

    });

}


const searchInput = document.getElementById("searchInput");
const issueTypeFilter = document.getElementById("issueTypeFilter");
const statusFilter = document.getElementById("statusFilter");
const priorityFilter = document.getElementById("priorityFilter");
const assignedFilter = document.getElementById("assignedFilter");

if (
    searchInput &&
    issueTypeFilter &&
    statusFilter &&
    priorityFilter &&
    assignedFilter &&
    ticketList
) {

    function filterTickets() {

        const keyword = searchInput.value.toLowerCase();
        const selectedType = issueTypeFilter.value;
        const selectedStatus = statusFilter.value;
        const selectedPriority = priorityFilter.value;
        const selectedAssigned = assignedFilter.value;

        const latestTickets =
            JSON.parse(localStorage.getItem("tickets")) || [];

        const filteredTickets = latestTickets.filter(function(ticket) {

            const matchSearch =
                ticket.ticketId.toLowerCase().includes(keyword) ||
                ticket.title.toLowerCase().includes(keyword) ||
                ticket.description.toLowerCase().includes(keyword);

            const matchType =
                selectedType === "" ||
                ticket.issueType === selectedType;

            const matchStatus =
                selectedStatus === "" ||
                ticket.status === selectedStatus;

            const matchPriority =
                selectedPriority === "" ||
                ticket.priority === selectedPriority;

            const matchAssigned =
                selectedAssigned === "" ||
                (selectedAssigned === "ยังไม่ได้มอบหมาย"
                    ? ticket.assignedTo === ""
                    : ticket.assignedTo === selectedAssigned);

            return (
                matchSearch &&
                matchType &&
                matchStatus &&
                matchPriority &&
                matchAssigned
            );

        });

        ticketList.innerHTML = "";

        filteredTickets.forEach(function(ticket) {

            const ticketItem = document.createElement("div");

            ticketItem.innerHTML = `
                <h3>
                    <a href="ticket.html?id=${ticket.ticketId}">
                        ${ticket.ticketId}
                    </a>
                </h3>
                <p>หัวข้อ: ${ticket.title}</p>
                <p>ผู้แจ้ง: ${ticket.requesterName}</p>
                <p>ประเภท: ${ticket.issueType}</p>
                <p>สถานที่: ${ticket.location}</p>
                <p>ความเร่งด่วน: ${ticket.priority}</p>
                <p>
                    สถานะ:
                    <span class="status-badge ${
                        ticket.status === "Open"
                            ? "status-open"
                            : ticket.status === "In Progress"
                            ? "status-progress"
                            : ticket.status === "Resolved"
                            ? "status-resolved"
                            : "status-cancelled"
                    }">
                        ${ticket.status}
                    </span>
                </p>
                <p>ผู้รับผิดชอบ: ${ticket.assignedTo || "-"}</p>

                <div style="display: flex; justify-content: flex-end;">
                    <p style="font-size: 13px; color: #666;">
                        วันที่แจ้ง: ${
                            ticket.createdAt
                                ? new Date(ticket.createdAt).toLocaleString("th-TH")
                                : "-"
                        }
                    </p>
                </div>
            `;

            ticketList.appendChild(ticketItem);

        });

    }

    searchInput.addEventListener("input", filterTickets);
    issueTypeFilter.addEventListener("change", filterTickets);
    statusFilter.addEventListener("change", filterTickets);
    priorityFilter.addEventListener("change", filterTickets);
    assignedFilter.addEventListener("change", filterTickets);

}


const totalCount = document.getElementById("totalCount");
const openCount = document.getElementById("openCount");
const progressCount = document.getElementById("progressCount");
const resolvedCount = document.getElementById("resolvedCount");
const cancelledCount = document.getElementById("cancelledCount");

if (
    totalCount &&
    openCount &&
    progressCount &&
    resolvedCount &&
    cancelledCount
) {

    function updateDashboard() {

        const latestTickets =
            JSON.parse(localStorage.getItem("tickets")) || [];

        totalCount.textContent = latestTickets.length;

        openCount.textContent =
            latestTickets.filter(function(ticket) {
                return ticket.status === "Open";
            }).length;

        progressCount.textContent =
            latestTickets.filter(function(ticket) {
                return ticket.status === "In Progress";
            }).length;

        resolvedCount.textContent =
            latestTickets.filter(function(ticket) {
                return ticket.status === "Resolved";
            }).length;

        cancelledCount.textContent =
            latestTickets.filter(function(ticket) {
                return ticket.status === "Cancelled";
            }).length;
    }

    updateDashboard();

}

const issueTypeSummary =
    document.getElementById("issueTypeSummary");

const prioritySummary =
    document.getElementById("prioritySummary");


if (issueTypeSummary && prioritySummary) {

    function updateSummary() {

        const latestTickets =
            JSON.parse(localStorage.getItem("tickets")) || [];


        // สรุปประเภทปัญหา

      const issueTypes =
        JSON.parse(localStorage.getItem("issueTypes")) || [
            "Computer Hardware",
            "Software/Application",
            "Network/Internet",
            "Printer/Scanner",
            "Classroom/Lab Room",
            "Account/Login",
            "Other"
        ];

    let otherCount = 0;

    issueTypeSummary.innerHTML = "";

    issueTypes.forEach(function(type) {

        if (type === "Other") {
            return;
        }

        const count =
            latestTickets.filter(function(ticket) {
                return ticket.issueType === type;
            }).length;

        issueTypeSummary.innerHTML += `
            <p>${type}: ${count}</p>
        `;

    });


    latestTickets.forEach(function(ticket) {

        if (!issueTypes.includes(ticket.issueType)) {
            otherCount++;
        }

    });


    const normalOtherCount =
        latestTickets.filter(function(ticket) {
            return ticket.issueType === "Other";
        }).length;

    otherCount += normalOtherCount;


    issueTypeSummary.innerHTML += `
        <p>Other: ${otherCount}</p>
    `;

        // สรุปความเร่งด่วน

        const priorities = [
            "Low",
            "Medium",
            "High",
            "Urgent"
        ];

        prioritySummary.innerHTML = "";

        priorities.forEach(function(priority) {

            const count =
                latestTickets.filter(function(ticket) {
                    return ticket.priority === priority;
                }).length;

            prioritySummary.innerHTML += `
                <p>${priority}: ${count}</p>
            `;

        });

    }

    updateSummary();

}




const deleteTicket = document.getElementById("deleteTicket");

if (deleteTicket && ticketDetail) {

    const params = new URLSearchParams(window.location.search);
    const ticketId = params.get("id");

    deleteTicket.addEventListener("click", function() {

        const confirmDelete =
            confirm("ต้องการลบ Ticket นี้หรือไม่?");

        if (!confirmDelete) {
            return;
        }

        tickets = tickets.filter(function(ticket) {
            return ticket.ticketId !== ticketId;
        });

        localStorage.setItem("tickets", JSON.stringify(tickets));

        alert("ลบ Ticket เรียบร้อย");

        window.location.href = "admin.html";

    });

}


const myTicketList = document.getElementById("myTicketList");


if (myTicketList) {

    function showMyTickets() {

        const latestTickets =
            JSON.parse(localStorage.getItem("tickets")) || [];

        myTicketList.innerHTML = "";

        latestTickets.slice().reverse().forEach(function(ticket) {

            const ticketItem = document.createElement("div");

            ticketItem.innerHTML = `
                <h3>
                    <a href="ticket-user.html?id=${ticket.ticketId}">
                        ${ticket.ticketId}
                    </a>
                </h3>

                <p>หัวข้อ: ${ticket.title}</p>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                <p>
                    สถานะ:
                    <span class="status-badge ${
                        ticket.status === "Open"
                            ? "status-open"
                            : ticket.status === "In Progress"
                            ? "status-progress"
                            : ticket.status === "Resolved"
                            ? "status-resolved"
                            : "status-cancelled"
                    }">
                        ${ticket.status}
                    </span>
                </p>

                    <p style="font-size: 13px; color: #666;">
                        วันที่ส่ง: ${new Date(ticket.createdAt).toLocaleString("th-TH")}
                    </p>
                </div>

            `;

            myTicketList.appendChild(ticketItem);

        });

    }

    showMyTickets();

}



const userTicketDetail = 
    document.getElementById("userTicketDetail"); 
 
if (userTicketDetail) { 
 
    const params = 
        new URLSearchParams(window.location.search); 
 
    const ticketId = 
        params.get("id"); 
 
    const latestTickets = 
        JSON.parse(localStorage.getItem("tickets")) || []; 
 
    const ticket = 
        latestTickets.find(function(ticket) { 
            return ticket.ticketId === ticketId; 
        }); 
 
    if (ticket) { 
 
        userTicketDetail.innerHTML = ` 
            <h2>${ticket.ticketId}</h2> 
 
            <p><strong>หัวข้อ:</strong> ${ticket.title}</p> 
 
            <p class="ticket-description"> 
                <strong>รายละเอียด:</strong> 
                <span>${ticket.description}</span> 
            </p> 
 
            <p><strong>ผู้แจ้ง:</strong> ${ticket.requesterName}</p> 

            <p><strong>อีเมล:</strong> ${ticket.requesterEmail || "-"}</p>
 
            <p><strong>ประเภท:</strong> ${ticket.issueType}</p> 
 
            <p><strong>สถานที่:</strong> ${ticket.location}</p> 
 
            <p><strong>ความเร่งด่วน:</strong> ${ticket.priority}</p> 
 
            <p>
                <strong>สถานะ:</strong>
                <span class="status-badge ${
                    ticket.status === "Open"
                        ? "status-open"
                        : ticket.status === "In Progress"
                        ? "status-progress"
                        : ticket.status === "Resolved"
                        ? "status-resolved"
                        : "status-cancelled"
                }">
                    ${ticket.status}
                </span>
            </p> 

            <p><strong>วันที่แจ้ง:</strong> ${formatThaiDate(ticket.createdAt)}</p>

            <p><strong>แก้ไขล่าสุด:</strong> ${formatThaiDate(ticket.updatedAt)}</p>
 
            <p><strong>หมายเหตุการแก้ไข:</strong> ${ticket.resolutionNote || "-"}</p>
        `; 
 
    } else { 
 
        userTicketDetail.innerHTML = 
            "<p>ไม่พบ Ticket</p>"; 
 
    } 
 
    const editUserTicket = 
        document.getElementById("editUserTicket"); 
 
    const cancelUserTicket = 
        document.getElementById("cancelUserTicket"); 
 
    if (ticket && ticket.status !== "Open") { 
 
        editUserTicket.style.display = "none"; 
 
        cancelUserTicket.style.display = "none"; 
 
    } 
     
}





const editUserTicket =
    document.getElementById("editUserTicket");

if (editUserTicket && userTicketDetail) {

    editUserTicket.addEventListener("click", function() {

        const params =
            new URLSearchParams(window.location.search);

        const ticketId =
            params.get("id");

        const latestTickets =
            JSON.parse(localStorage.getItem("tickets")) || [];

        const ticket =
            latestTickets.find(function(ticket) {
                return ticket.ticketId === ticketId;
            });

        if (!ticket) {
            alert("ไม่พบ Ticket");
            return;
        }

        if (ticket.status !== "Open") {
            alert("ไม่สามารถแก้ไข Ticket ที่กำลังดำเนินการได้");
            return;
        }

        const newTitle =
            prompt("แก้ไขหัวข้อปัญหา", ticket.title);

        if (newTitle === null) {
            return;
        }

        const newDescription =
            prompt("แก้ไขรายละเอียดปัญหา", ticket.description);

        if (newDescription === null) {
            return;
        }

       if (
            newTitle.trim() === "" ||
            newDescription.trim() === ""
        ) {
            alert("หัวข้อและรายละเอียดห้ามว่าง");
            return;
        }

        ticket.title = newTitle;
        ticket.description = newDescription;
        ticket.updatedAt = new Date().toISOString();

        localStorage.setItem(
            "tickets",
            JSON.stringify(latestTickets)
        );

        alert("แก้ไข Ticket เรียบร้อย");

        location.reload();

    });

}


const cancelUserTicket =
    document.getElementById("cancelUserTicket");

if (cancelUserTicket && userTicketDetail) {

    cancelUserTicket.addEventListener("click", function() {

        const params =
            new URLSearchParams(window.location.search);

        const ticketId =
            params.get("id");

        const latestTickets =
            JSON.parse(localStorage.getItem("tickets")) || [];

        const ticket =
            latestTickets.find(function(ticket) {
                return ticket.ticketId === ticketId;
            });

        if (!ticket) {
            alert("ไม่พบ Ticket");
            return;
        }

        if (ticket.status !== "Open") {
            alert("ไม่สามารถยกเลิก Ticket ที่กำลังดำเนินการได้");
            return;
        }

        const confirmCancel =
            confirm("ต้องการยกเลิก Ticket นี้หรือไม่?");

        if (!confirmCancel) {
            return;
        }

        ticket.status = "Cancelled";
        ticket.updatedAt = new Date().toISOString();
 
        localStorage.setItem(
            "tickets",
            JSON.stringify(latestTickets)
        );

        alert("ยกเลิก Ticket เรียบร้อย");

        location.reload();

    });

}

const staffTicketList =
    document.getElementById("staffTicketList");

const staffSelect =
    document.getElementById("staffSelect");

if (staffTicketList && staffSelect) {

    function showStaffTickets() {

        const selectedStaff =
            staffSelect.value;

        const latestTickets =
            JSON.parse(localStorage.getItem("tickets")) || [];

        const assignedTickets =
            latestTickets.filter(function(ticket) {
                return ticket.assignedTo === selectedStaff;
            });

        if (assignedTickets.length === 0) {

            staffTicketList.innerHTML =
                "<p>ยังไม่มี Ticket ที่ได้รับมอบหมาย</p>";

            return;
        }

        staffTicketList.innerHTML =
            assignedTickets
            .slice()
            .sort(function(a, b) {
                return new Date(b.assignedAt) - new Date(a.assignedAt);
            })
            .map(function(ticket) {

                return `
                    <div class="ticket-card">

                        <h3>${ticket.ticketId}</h3>

                        <p>
                            <strong>หัวข้อ:</strong>
                            ${ticket.title}
                        </p>

                        <p>
                            <strong>ประเภท:</strong>
                            ${ticket.issueType}
                        </p>

                        <p>
                            <strong>ความเร่งด่วน:</strong>
                            ${ticket.priority}
                        </p>

                        <p>
                            <strong>สถานะ:</strong>
                            <span class="status-badge ${
                                ticket.status === "Open"
                                    ? "status-open"
                                    : ticket.status === "In Progress"
                                    ? "status-progress"
                                    : ticket.status === "Resolved"
                                    ? "status-resolved"
                                    : "status-cancelled"
                            }">
                                ${ticket.status}
                            </span>
                        </p>

                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <a href="staff-ticket.html?id=${ticket.ticketId}">
                                ดูรายละเอียด
                            </a>

                            <p style="font-size: 13px; color: #666;">
                                ได้รับมอบหมาย: ${
                                    ticket.assignedAt
                                        ? new Date(ticket.assignedAt).toLocaleString("th-TH")
                                        : "-"
                                }
                            </p>
                        </div>

                    </div>
                `;

            }).join("");
    }

    staffSelect.addEventListener(
        "change",
        showStaffTickets
    );

    showStaffTickets();
}

const staffTicketDetail =
    document.getElementById("staffTicketDetail");

if (staffTicketDetail) {

    const params =
        new URLSearchParams(window.location.search);

    const ticketId =
        params.get("id");

    const latestTickets =
        JSON.parse(localStorage.getItem("tickets")) || [];

    const ticket =
        latestTickets.find(function(ticket) {
            return ticket.ticketId === ticketId;
        });

    if (ticket) {

        staffTicketDetail.innerHTML = `

            <h2>${ticket.ticketId}</h2>

            <p>
                <strong>หัวข้อ:</strong>
                ${ticket.title}
            </p>

            <p>
                <strong>รายละเอียด:</strong>
                ${ticket.description}
            </p>

            <p>
                <strong>ผู้แจ้ง:</strong>
                ${ticket.requesterName}
            </p>

            <p>
                <strong>อีเมล:</strong>
                ${ticket.requesterEmail || "-"}
            </p>

            <p>
                <strong>ประเภท:</strong>
                ${ticket.issueType}
            </p>

            <p>
                <strong>สถานที่:</strong>
                ${ticket.location}
            </p>

            <p>
                <strong>ความเร่งด่วน:</strong>
                ${ticket.priority}
            </p>

            <p>
                <strong>สถานะ:</strong>
                <span class="status-badge ${
                    ticket.status === "Open"
                        ? "status-open"
                        : ticket.status === "In Progress"
                        ? "status-progress"
                        : ticket.status === "Resolved"
                        ? "status-resolved"
                        : "status-cancelled"
                }">
                    ${ticket.status}
                </span>
            </p>

            <p>
                <strong>วันที่แจ้ง:</strong>
                ${formatThaiDate(ticket.createdAt)}
            </p>

            <p>
                <strong>แก้ไขล่าสุด:</strong>
                ${formatThaiDate(ticket.updatedAt)}
            </p>

            <p>
                <strong>ผู้รับผิดชอบ:</strong>
                ${ticket.assignedTo || "-"}
            </p>

            <p>
                <strong>หมายเหตุการแก้ไข:</strong>
                ${ticket.resolutionNote || "-"}
            </p>

        `;

        document.getElementById("staffStatusSelect").value =
            ticket.status;

        document.getElementById("staffResolutionNote").value =
            ticket.resolutionNote || "";

    }
}


const staffSaveStatus =
    document.getElementById("staffSaveStatus");

if (staffSaveStatus) {

    staffSaveStatus.addEventListener("click", function() {

        const params =
            new URLSearchParams(window.location.search);

        const ticketId =
            params.get("id");

        const latestTickets =
            JSON.parse(localStorage.getItem("tickets")) || [];

        const ticket =
            latestTickets.find(function(ticket) {
                return ticket.ticketId === ticketId;
            });

        if (ticket) {

            const newStatus =
                document.getElementById("staffStatusSelect").value;

            ticket.status = newStatus;
            ticket.updatedAt = new Date().toISOString();

            localStorage.setItem(
                "tickets",
                JSON.stringify(latestTickets)
            );

            alert("บันทึกสถานะเรียบร้อย");

            location.reload();
        }

    });

}


const staffSaveNote =
    document.getElementById("staffSaveNote");

if (staffSaveNote) {

    staffSaveNote.addEventListener("click", function() {

        const params =
            new URLSearchParams(window.location.search);

        const ticketId =
            params.get("id");

        const latestTickets =
            JSON.parse(localStorage.getItem("tickets")) || [];

        const ticket =
            latestTickets.find(function(ticket) {
                return ticket.ticketId === ticketId;
            });

        if (ticket) {

            const newNote =
                document.getElementById("staffResolutionNote").value;

            ticket.resolutionNote = newNote;
            ticket.updatedAt = new Date().toISOString();

            localStorage.setItem(
                "tickets",
                JSON.stringify(latestTickets)
            );

            alert("บันทึกหมายเหตุเรียบร้อย");

            location.reload();
        }

    });

}


const issueTypeList =
    document.getElementById("issueTypeList");

const addIssueType =
    document.getElementById("addIssueType");

const issueTypeName =
    document.getElementById("issueTypeName");


if (issueTypeList && addIssueType && issueTypeName) {

    function showIssueTypes() {

        const issueTypes =
            JSON.parse(localStorage.getItem("issueTypes")) || [
                "Computer Hardware",
                "Software/Application",
                "Network/Internet",
                "Printer/Scanner",
                "Classroom/Lab Room",
                "Account/Login",
                "Other"
            ];

        issueTypeList.innerHTML =
            issueTypes.map(function(type, index) {

                return `
                    <div class="ticket-card">

                        <strong>${type}</strong>

                        <button
                            onclick="deleteIssueType(${index})">
                            ลบ
                        </button>

                    </div>
                `;

            }).join("");

        localStorage.setItem(
            "issueTypes",
            JSON.stringify(issueTypes)
        );
    }


    addIssueType.addEventListener("click", function() {

        const newType =
            issueTypeName.value.trim();

        if (newType === "") {

            alert("กรุณากรอกชื่อประเภทปัญหา");

            return;
        }

        const issueTypes =
            JSON.parse(localStorage.getItem("issueTypes")) || [
                "Computer Hardware",
                "Software/Application",
                "Network/Internet",
                "Printer/Scanner",
                "Classroom/Lab Room",
                "Account/Login",
                "Other"
            ];

        issueTypes.push(newType);

        localStorage.setItem(
            "issueTypes",
            JSON.stringify(issueTypes)
        );

        issueTypeName.value = "";

        showIssueTypes();

    });


    window.deleteIssueType = function(index) {

        const issueTypes =
            JSON.parse(localStorage.getItem("issueTypes")) || [];

        issueTypes.splice(index, 1);

        localStorage.setItem(
            "issueTypes",
            JSON.stringify(issueTypes)
        );

        showIssueTypes();

    };


    showIssueTypes();

}

const issueTypeSelect =
    document.getElementById("issueType");

if (issueTypeSelect) {

    const issueTypes =
        JSON.parse(localStorage.getItem("issueTypes")) || [
            "Computer Hardware",
            "Software/Application",
            "Network/Internet",
            "Printer/Scanner",
            "Classroom/Lab Room",
            "Account/Login",
            "Other"
        ];

    issueTypeSelect.innerHTML =
        issueTypes.map(function(type) {

            return `
                <option value="${type}">
                    ${type}
                </option>
            `;

        }).join("");

}