require('dotenv').config();

const express = require('express');
const path = require('path');
const sequelize = require('./config/Database');
//error handler
const ErrorHandler = require('./controller/ErrorController');
//security
const cors = require('cors');
//routes
const AuthRoutes = require('./route/AuthRoutes');
const ActionRoutes = require('./route/ActionRoutes');
const FamilyRoutes = require('./route/FamilyRoutes');
const PieceRoutes = require('./route/PieceRoutes');
const WorkshopRoutes = require('./route/WorkshopRoutes');
const ZoneRoutes = require('./route/ZoneRoutes');
const ProductRoutes = require('./route/ProductRoutes');
const PanneRoutes = require('./route/PanneRoutes');
const ConsommationRoutes = require('./route/ConsommationRoutes');
const ActionCorrectiveRoutes = require('./route/ActionCorrectiveRoutes');
const UsersRoutes = require('./route/UsersRoutes');
const DashboardRoutes = require('./route/DashboardRoutes');
const PanneTypeRoutes = require('./route/PanneTypeRoutes');
const TechnicianRoutes = require('./route/TechnicianRoutes');
const AgentRoutes = require('./route/AgentRoutes');
const DisplayerRoutes = require('./route/DisplayerRoutes');
const LotRoutes = require('./route/LotRoutes');
const FileUploaderRoutes = require('./route/FileUploaderRoutes');
const PanneTypeAssignmentRoutes = require('./route/PanneTypeAssignmentRoutes');
const AgentUpdateActionsRoutes = require('./route/AgentUpdateActionsRoutes');
const ArrivalRoutes = require('./route/ArrivalRoutes');


//http server
const http = require('http');
const port = process.env.PORT || 8080;

//express app
const app = express();
const server = http.createServer(app);

//midlewares
//cors
app.use(cors());
//static files
app.use('/files', express.static('./files'));
//body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: false }));

//routes
app.use('/api/auth', AuthRoutes);
app.use('/api/action', ActionRoutes);
app.use('/api/family', FamilyRoutes);
app.use('/api/piece', PieceRoutes);
app.use('/api/workshop', WorkshopRoutes);
app.use('/api/zone', ZoneRoutes);
app.use('/api/product', ProductRoutes);
app.use('/api/panne', PanneRoutes);
app.use('/api/consommation', ConsommationRoutes);
app.use('/api/actioncorrective', ActionCorrectiveRoutes);
app.use('/api/users', UsersRoutes);
app.use('/api/dashboard', DashboardRoutes);
app.use('/api/pannetype', PanneTypeRoutes);
app.use('/api/technician', TechnicianRoutes);
app.use('/api/agent', AgentRoutes);
app.use('/api/displayer', DisplayerRoutes);
app.use('/api/lot', LotRoutes);
app.use('/api/xlsx', FileUploaderRoutes);
app.use('/api/pannetypeassignment', PanneTypeAssignmentRoutes);
app.use('/api/agentupdateactions', AgentUpdateActionsRoutes);
app.use('/api/arrival', ArrivalRoutes);

//error handling
app.use(ErrorHandler);

//client static files
app.use(express.static("./public/dist"));
app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public","dist", "index.html"));
});

// Disable logging of SQL queries
sequelize.options.logging = false;
//connect to db
sequelize.sync().then(() => {
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((error) => {
    console.error('Database connection error:', error);
});