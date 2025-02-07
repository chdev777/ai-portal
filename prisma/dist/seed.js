"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var userTypeSuperAdmin, userTypeAdmin, userTypeInfoSupport, userTypeRegular, superAdminUser, adminUser, regularUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.userType.upsert({
                        where: { id: "super-admin-type-id" },
                        update: {},
                        create: {
                            id: "super-admin-type-id",
                            name: "SuperAdmin",
                        },
                    })];
                case 1:
                    userTypeSuperAdmin = _a.sent();
                    return [4 /*yield*/, prisma.userType.upsert({
                            where: { id: "admin-type-id" },
                            update: {},
                            create: {
                                id: "admin-type-id",
                                name: "Admin",
                            },
                        })];
                case 2:
                    userTypeAdmin = _a.sent();
                    return [4 /*yield*/, prisma.userType.upsert({
                            where: { id: "info-support-type-id" },
                            update: {},
                            create: {
                                id: "info-support-type-id",
                                name: "InfoSupport",
                            },
                        })];
                case 3:
                    userTypeInfoSupport = _a.sent();
                    return [4 /*yield*/, prisma.userType.upsert({
                            where: { id: "regular-type-id" },
                            update: {},
                            create: {
                                id: "regular-type-id",
                                name: "Regular",
                            },
                        })];
                case 4:
                    userTypeRegular = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { id: "super-admin-id" },
                            update: {},
                            create: {
                                id: "super-admin-id",
                                username: "superadmin",
                                email: "superadmin@example.com",
                                emailVerified: new Date(),
                                password: "superpassword",
                                role: "SUPERUSER",
                                userTypeId: userTypeSuperAdmin.id,
                            },
                        })];
                case 5:
                    superAdminUser = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { id: "admin-id" },
                            update: {},
                            create: {
                                id: "admin-id",
                                username: "admin",
                                email: "admin@example.com",
                                emailVerified: new Date(),
                                password: "adminpassword",
                                role: "ADMIN",
                                userTypeId: userTypeAdmin.id,
                            },
                        })];
                case 6:
                    adminUser = _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { id: "regular-id" },
                            update: {},
                            create: {
                                id: "regular-id",
                                username: "regular",
                                email: "regular@example.com",
                                emailVerified: new Date(),
                                password: "userpassword",
                                role: "USER",
                                userTypeId: userTypeRegular.id,
                            },
                        })];
                case 7:
                    regularUser = _a.sent();
                    // 管理者用アプリの作成
                    return [4 /*yield*/, prisma.chatApp.upsert({
                            where: { id: "admin-dashboard-id" },
                            update: {},
                            create: {
                                id: "admin-dashboard-id",
                                name: "Admin Dashboard",
                                description: "Administrative control panel",
                                details: "Complete administrative control and monitoring system",
                                url: "https://admin.example.com",
                                isVisibleToAll: false,
                                isAdminOnly: true,
                                createdById: superAdminUser.id,
                                userTypes: {
                                    connect: [{ id: userTypeSuperAdmin.id }, { id: userTypeAdmin.id }],
                                },
                            },
                        })];
                case 8:
                    // 管理者用アプリの作成
                    _a.sent();
                    // 一般ユーザー用アプリの作成
                    return [4 /*yield*/, prisma.chatApp.upsert({
                            where: { id: "user-portal-id" },
                            update: {},
                            create: {
                                id: "user-portal-id",
                                name: "User Portal",
                                description: "General user application",
                                details: "Access to general user features and services",
                                url: "https://portal.example.com",
                                isVisibleToAll: true,
                                isAdminOnly: false,
                                createdById: adminUser.id,
                                userTypes: {
                                    connect: [{ id: userTypeRegular.id }, { id: userTypeInfoSupport.id }],
                                },
                            },
                        })];
                case 9:
                    // 一般ユーザー用アプリの作成
                    _a.sent();
                    console.log("Seed data has been created!");
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
